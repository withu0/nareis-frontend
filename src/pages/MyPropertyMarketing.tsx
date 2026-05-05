import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ListingFormDialog } from '@/components/property-marketing/ListingFormDialog';
import { marketingAPI, getFileUrl, type MarketingListingMine } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Building2,
  DollarSign,
  ExternalLink,
  Loader2,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Ruler,
  Sparkles,
  Store,
  Trash2,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function formatMoney(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export default function MyPropertyMarketing() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editListing, setEditListing] = useState<MarketingListingMine | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MarketingListingMine | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['marketing', 'my-listings'],
    queryFn: () => marketingAPI.getMyListings(),
  });

  const listings = data?.listings ?? [];

  const stats = useMemo(() => {
    const active = listings.filter((l) => l.status === 'active').length;
    const archived = listings.filter((l) => l.status === 'archived').length;
    const leads = listings.reduce((sum, l) => sum + (l.interests?.length ?? 0), 0);
    return { total: listings.length, active, archived, leads };
  }, [listings]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => marketingAPI.deleteListing(id),
    onSuccess: () => {
      toast.success('Listing deleted');
      queryClient.invalidateQueries({ queryKey: ['marketing'] });
      setDeleteTarget(null);
    },
    onError: (e: Error & { response?: { data?: { error?: string } } }) => {
      toast.error(e.response?.data?.error || e.message || 'Failed to delete');
    },
  });

  return (
    <DashboardLayout>
      <SEOHead
        title="My property listings - NAREIS"
        description="Manage your property marketing listings and interested members."
      />

      <div data-tour="my-property-marketing">
        <div className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

          <div className="relative container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-100 flex items-center gap-2">
                  <Building2 className="h-9 w-9 shrink-0" />
                  Property management
                </h1>
                <p className="text-teal-50 text-sm md:text-base font-medium max-w-2xl">
                  Create, edit, or archive listings. Track who expressed interest on each property.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  className="bg-white/15 hover:bg-white/25 text-white border-white/30"
                  onClick={() => navigate('/property-marketing')}
                >
                  <Store className="h-4 w-4 mr-2" />
                  Marketplace
                </Button>
                <Button className="bg-white text-teal-800 hover:bg-teal-50" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add listing
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
          {!isLoading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { label: 'Total listings', value: stats.total, sub: 'All time' },
                { label: 'Active', value: stats.active, sub: 'On marketplace' },
                { label: 'Archived', value: stats.archived, sub: 'Hidden' },
                { label: 'Total leads', value: stats.leads, sub: 'Interested members' },
              ].map((s) => (
                <Card key={s.label} className="border-teal-100 shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardDescription className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {s.label}
                    </CardDescription>
                    <CardTitle className="text-2xl md:text-3xl font-bold tabular-nums">{s.value}</CardTitle>
                    <p className="text-xs text-muted-foreground">{s.sub}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
            </div>
          )}

          {error && (
            <p className="text-center text-destructive py-8">Could not load your listings. Try again later.</p>
          )}

          {!isLoading && !error && listings.length === 0 && (
            <Card className="border-dashed">
              <CardHeader className="text-center pb-2">
                <CardTitle>No listings yet</CardTitle>
                <CardDescription>
                  Create your first listing here, or post from the public marketplace page.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row justify-center gap-3 pb-8">
                <Button onClick={() => setCreateOpen(true)} className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create listing
                </Button>
                <Button variant="outline" onClick={() => navigate('/property-marketing')}>
                  Open marketplace
                </Button>
              </CardContent>
            </Card>
          )}

          {!isLoading &&
            !error &&
            listings.map((listing) => (
              <Card
                key={listing.id}
                className="overflow-hidden border-teal-100/80 shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-stretch">
                  <div className="sm:w-56 shrink-0 h-48 sm:h-auto sm:min-h-[200px] bg-muted relative">
                    {listing.imageUrls[0] ? (
                      <img
                        src={getFileUrl(listing.imageUrls[0])}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                        No image
                      </div>
                    )}
                    <div className="absolute left-2 top-2 flex flex-wrap gap-1.5 max-w-[calc(100%-1rem)]">
                      <Badge
                        variant={listing.status === 'active' ? 'default' : 'secondary'}
                        className={
                          listing.status === 'active'
                            ? 'bg-emerald-600 hover:bg-emerald-600'
                            : 'bg-slate-600 text-white hover:bg-slate-600'
                        }
                      >
                        {listing.status === 'active' ? 'Active' : 'Archived'}
                      </Badge>
                      {listing.status === 'active' && listing.visibility === 'hidden' && (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-900 border-amber-300 shadow-sm"
                        >
                          Not on marketplace
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <CardTitle className="text-lg md:text-xl flex items-start gap-2 pr-2">
                            <MapPin className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                            <span className="break-words">{listing.location}</span>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground capitalize mt-1">
                            {listing.dealType.replace(/-/g, ' ')}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9">
                              <MoreHorizontal className="h-5 w-5" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => setEditListing(listing)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {listing.status === 'active' && listing.visibility === 'visible' && (
                              <DropdownMenuItem asChild>
                                <Link to={`/property-marketing/${listing.id}`} className="cursor-pointer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View on marketplace
                                </Link>
                              </DropdownMenuItem>
                            )}
                            {listing.status === 'active' && listing.visibility === 'hidden' && (
                              <DropdownMenuItem disabled className="text-muted-foreground">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Hidden from marketplace
                              </DropdownMenuItem>
                            )}
                            {listing.status === 'archived' && (
                              <DropdownMenuItem disabled className="text-muted-foreground">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Hidden while archived
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteTarget(listing)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-0 flex-1 flex flex-col">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Ruler className="h-4 w-4 shrink-0" />
                          <span>{listing.squareFootage.toLocaleString()} sq ft</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                          <DollarSign className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {formatMoney(listing.priceMin)} – {formatMoney(listing.priceMax)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Sparkles className="h-4 w-4 shrink-0" />
                          <span className="truncate">ARV {formatMoney(listing.estimatedArv)}</span>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                          <Users className="h-4 w-4 text-teal-600" />
                          Interested members ({listing.interests.length})
                        </h3>
                        {listing.interests.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No leads yet. Active listings appear on the marketplace for others to discover.
                          </p>
                        ) : (
                          <ul className="grid gap-2 sm:grid-cols-2">
                            {listing.interests.map((row) => (
                              <li
                                key={row.id}
                                className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3 text-sm"
                              >
                                <Avatar className="h-9 w-9 shrink-0">
                                  {row.profilePictureUrl ? (
                                    <AvatarImage src={getFileUrl(row.profilePictureUrl)} alt="" />
                                  ) : null}
                                  <AvatarFallback className="text-xs">
                                    {(row.fullName || row.email || '?').charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium truncate">{row.fullName || 'Member'}</p>
                                  <p className="text-muted-foreground truncate text-xs break-all">{row.email}</p>
                                  {row.phone && (
                                    <p className="text-muted-foreground text-xs mt-0.5">{row.phone}</p>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>

      <ListingFormDialog open={createOpen} onOpenChange={setCreateOpen} mode="create" />

      <ListingFormDialog
        open={Boolean(editListing)}
        onOpenChange={(o) => !o && setEditListing(null)}
        mode="edit"
        listing={editListing ?? undefined}
      />

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the listing and all interest records for{' '}
              <strong className="text-foreground">{deleteTarget?.location}</strong>. Photos stored for this listing
              will be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!deleteTarget) return;
                deleteMutation.mutate(deleteTarget.id);
              }}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                'Delete listing'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
