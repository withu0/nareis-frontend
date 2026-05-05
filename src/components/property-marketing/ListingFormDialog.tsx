import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { marketingAPI, getFileUrl, type MarketingListingMine } from '@/lib/api';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

const DEAL_TYPES = [
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'wholetail', label: 'Wholetail' },
  { value: 'flip', label: 'Flip' },
  { value: 'buy-and-hold', label: 'Buy & hold' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'other', label: 'Other' },
];

const formSchema = z
  .object({
    location: z.string().min(1, 'Location is required'),
    dealType: z.string().min(1),
    squareFootage: z.coerce.number().min(0, 'Must be 0 or more'),
    priceMin: z.coerce.number().min(0),
    priceMax: z.coerce.number().min(0),
    estimatedArv: z.coerce.number().min(0),
    /** Show on public marketplace vs keep in your list only */
    visibility: z.enum(['visible', 'hidden']),
    status: z.enum(['active', 'archived']),
  })
  .refine((d) => d.priceMin <= d.priceMax, {
    message: 'Min price must be ≤ max price',
    path: ['priceMax'],
  });

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  location: '',
  dealType: 'wholesale',
  squareFootage: 0,
  priceMin: 0,
  priceMax: 0,
  estimatedArv: 0,
  visibility: 'visible',
  status: 'active',
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  listing?: MarketingListingMine | null;
};

export function ListingFormDialog({ open, onOpenChange, mode, listing }: Props) {
  const queryClient = useQueryClient();
  const [createFiles, setCreateFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && listing) {
      form.reset({
        location: listing.location,
        dealType: listing.dealType,
        squareFootage: listing.squareFootage,
        priceMin: listing.priceMin,
        priceMax: listing.priceMax,
        estimatedArv: listing.estimatedArv,
        visibility: listing.visibility === 'hidden' ? 'hidden' : 'visible',
        status: (listing.status === 'archived' ? 'archived' : 'active') as 'active' | 'archived',
      });
      setImageUrls([...listing.imageUrls]);
      setPendingFiles([]);
      setCreateFiles([]);
    } else if (mode === 'create') {
      form.reset(defaultValues);
      setCreateFiles([]);
      setImageUrls([]);
      setPendingFiles([]);
    }
  }, [open, mode, listing, form]);

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const fd = new FormData();
      fd.append('location', values.location.trim());
      fd.append('dealType', values.dealType);
      fd.append('squareFootage', String(values.squareFootage));
      fd.append('priceMin', String(values.priceMin));
      fd.append('priceMax', String(values.priceMax));
      fd.append('estimatedArv', String(values.estimatedArv));
      fd.append('visibility', values.visibility);
      createFiles.forEach((f) => fd.append('images', f));
      return marketingAPI.createListing(fd);
    },
    onSuccess: () => {
      toast.success('Listing created');
      queryClient.invalidateQueries({ queryKey: ['marketing'] });
      onOpenChange(false);
    },
    onError: (e: Error & { response?: { data?: { error?: string } } }) => {
      toast.error(e.response?.data?.error || e.message || 'Failed to create');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!listing) throw new Error('No listing');
      await marketingAPI.updateListing(listing.id, {
        location: values.location.trim(),
        dealType: values.dealType,
        squareFootage: values.squareFootage,
        priceMin: values.priceMin,
        priceMax: values.priceMax,
        estimatedArv: values.estimatedArv,
        visibility: values.visibility,
        status: values.status,
        imageUrls,
      });
      if (pendingFiles.length) {
        const fd = new FormData();
        pendingFiles.forEach((f) => fd.append('images', f));
        await marketingAPI.appendListingImages(listing.id, fd);
      }
    },
    onSuccess: () => {
      toast.success('Listing updated');
      queryClient.invalidateQueries({ queryKey: ['marketing'] });
      onOpenChange(false);
    },
    onError: (e: Error & { response?: { data?: { error?: string } } }) => {
      toast.error(e.response?.data?.error || e.message || 'Failed to update');
    },
  });

  const onSubmit = (values: FormValues) => {
    if (mode === 'create') {
      if (!createFiles.length) {
        toast.error('Add at least one image');
        return;
      }
      createMutation.mutate(values);
      return;
    }
    if (imageUrls.length === 0) {
      toast.error('At least one image is required. Add photos before removing the last one.');
      return;
    }
    updateMutation.mutate(values);
  };

  const busy = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'New listing' : 'Edit listing'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add details and at least one photo. You can manage leads on this page after publishing.'
              : 'Update your property details, visibility, and photos.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, State or address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dealType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deal type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DEAL_TYPES.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="squareFootage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Square footage</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="priceMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price min ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priceMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price max ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="estimatedArv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated ARV ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marketplace</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="visible">Shown on marketplace</SelectItem>
                      <SelectItem value="hidden">Hidden from marketplace</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Hidden listings stay in your dashboard but won&apos;t appear in the public list.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === 'edit' && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing state</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Archived removes the listing from your active workflow; you can still restore by editing.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {mode === 'create' && (
              <div className="space-y-2">
                <Label htmlFor="create-imgs">Images</Label>
                <Input
                  id="create-imgs"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setCreateFiles(Array.from(e.target.files || []))}
                />
                <p className="text-xs text-muted-foreground">At least one image required.</p>
              </div>
            )}

            {mode === 'edit' && listing && (
              <div className="space-y-3">
                <Label>Photos</Label>
                <div className="flex flex-wrap gap-2">
                  {imageUrls.map((url) => (
                    <div key={url} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
                      <img src={getFileUrl(url)} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        className="absolute right-0.5 top-0.5 rounded-full bg-background/90 p-0.5 shadow hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => {
                          if (imageUrls.length <= 1) {
                            toast.error('Keep at least one image on the listing.');
                            return;
                          }
                          setImageUrls((prev) => prev.filter((u) => u !== url));
                        }}
                        aria-label="Remove image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="more-imgs" className="text-muted-foreground font-normal">
                    Add more photos
                  </Label>
                  <Input
                    id="more-imgs"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setPendingFiles(Array.from(e.target.files || []))}
                  />
                  {pendingFiles.length > 0 && (
                    <p className="text-xs text-muted-foreground">{pendingFiles.length} file(s) will upload on save</p>
                  )}
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={busy}>
                {busy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : mode === 'create' ? (
                  'Publish listing'
                ) : (
                  'Save changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
