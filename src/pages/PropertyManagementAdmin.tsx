import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminListingFormDialog } from '@/components/admin/AdminListingFormDialog';
import { adminAPI, getFileUrl, type AdminPropertyListingRow } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, MoreHorizontal, Pencil, Plus, Search, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

function formatMoney(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export default function PropertyManagementAdmin() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all');

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 350);
    return () => window.clearTimeout(t);
  }, [searchInput]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editListing, setEditListing] = useState<AdminPropertyListingRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPropertyListingRow | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'property-listings', statusFilter, visibilityFilter, debouncedSearch],
    queryFn: async () => {
      const res = await adminAPI.getPropertyListings({
        status: statusFilter === 'all' ? undefined : statusFilter,
        visibility: visibilityFilter === 'all' ? undefined : visibilityFilter,
        search: debouncedSearch || undefined,
      });
      return res.data?.listings as AdminPropertyListingRow[] | undefined;
    },
  });

  const listings = data ?? [];

  const stats = useMemo(() => {
    const active = listings.filter((l) => l.status === 'active').length;
    const archived = listings.filter((l) => l.status === 'archived').length;
    const leads = listings.reduce((sum, l) => sum + (l.interestCount ?? 0), 0);
    return { total: listings.length, active, archived, leads };
  }, [listings]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deletePropertyListing(id),
    onSuccess: () => {
      toast.success('Listing deleted');
      queryClient.invalidateQueries({ queryKey: ['admin', 'property-listings'] });
      setDeleteTarget(null);
    },
    onError: (e: Error & { response?: { data?: { error?: string } } }) => {
      toast.error(e.response?.data?.error || e.message || 'Failed to delete');
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Property listings</h2>
            <p className="text-sm text-gray-500">
              Full CRUD for marketplace listings. Members normally manage their own from the dashboard.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Add listing
          </Button>
        </div>

        {!isLoading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total', value: stats.total },
              { label: 'Active', value: stats.active },
              { label: 'Archived', value: stats.archived },
              { label: 'Leads', value: stats.leads },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold tabular-nums">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="relative flex-1 max-w-md min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search location…"
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Listing state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All listing states</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Marketplace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All marketplace</SelectItem>
              <SelectItem value="visible">Shown on marketplace</SelectItem>
              <SelectItem value="hidden">Hidden from marketplace</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          {error && (
            <p className="p-8 text-center text-destructive">Failed to load listings.</p>
          )}
          {!isLoading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[72px]">Photo</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Deal</TableHead>
                  <TableHead className="text-right">Price range</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Marketplace</TableHead>
                  <TableHead className="text-center">Leads</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-12">
                      No listings match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  listings.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="h-12 w-12 overflow-hidden rounded-md border bg-muted">
                          {row.imageUrls[0] ? (
                            <img
                              src={getFileUrl(row.imageUrls[0])}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="line-clamp-2">{row.location}</span>
                      </TableCell>
                      <TableCell className="max-w-[180px]">
                        <div className="text-sm line-clamp-1">{row.owner?.fullName || '—'}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{row.owner?.email}</div>
                      </TableCell>
                      <TableCell className="capitalize text-sm">{row.dealType.replace(/-/g, ' ')}</TableCell>
                      <TableCell className="text-right text-sm tabular-nums whitespace-nowrap">
                        {formatMoney(row.priceMin)} – {formatMoney(row.priceMax)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={row.status === 'active' ? 'default' : 'secondary'}>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={row.visibility === 'visible' ? 'outline' : 'secondary'}>
                          {row.visibility === 'visible' ? 'Public' : 'Hidden'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center tabular-nums">{row.interestCount ?? 0}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/property-marketing/${row.id}`} className="cursor-pointer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View on site
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditListing(row)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteTarget(row)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <AdminListingFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
      />

      <AdminListingFormDialog
        open={!!editListing}
        onOpenChange={(o) => !o && setEditListing(null)}
        mode="edit"
        listing={editListing}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the listing, all expressed-interest records, and uploaded marketing images. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
