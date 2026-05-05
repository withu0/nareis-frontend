import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigation } from '@/components/narei/Navigation';
import Footer from '@/components/narei/Footer';
import { BackButton } from '@/components/ui/back-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { marketingAPI, getFileUrl } from '@/lib/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  DollarSign,
  LayoutDashboard,
  Loader2,
  Plus,
  Ruler,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '@/components/SEOHead';

const DEAL_TYPES = [
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'wholetail', label: 'Wholetail' },
  { value: 'flip', label: 'Flip' },
  { value: 'buy-and-hold', label: 'Buy & hold' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'other', label: 'Other' },
];

function formatMoney(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export default function PropertyMarketing() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [dealType, setDealType] = useState('wholesale');
  const [squareFootage, setSquareFootage] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [estimatedArv, setEstimatedArv] = useState('');
  const [marketplaceVisibility, setMarketplaceVisibility] = useState<'visible' | 'hidden'>('visible');
  const [files, setFiles] = useState<File[]>([]);

  /** Browse filters (public list) */
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dealTypeFilter, setDealTypeFilter] = useState<string>('all');
  const [filterBudgetMin, setFilterBudgetMin] = useState('');
  const [filterBudgetMax, setFilterBudgetMax] = useState('');
  const [filterSqftMin, setFilterSqftMin] = useState('');
  const [filterSqftMax, setFilterSqftMax] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 350);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const listingFilters = useMemo(() => {
    const parseOpt = (s: string) => {
      const n = Number(String(s).replace(/,/g, '').trim());
      return s.trim() === '' || Number.isNaN(n) ? undefined : n;
    };
    return {
      search: debouncedSearch || undefined,
      dealType: dealTypeFilter,
      budgetMin: parseOpt(filterBudgetMin),
      budgetMax: parseOpt(filterBudgetMax),
      sqftMin: parseOpt(filterSqftMin),
      sqftMax: parseOpt(filterSqftMax),
      sort: sortBy,
    };
  }, [
    debouncedSearch,
    dealTypeFilter,
    filterBudgetMin,
    filterBudgetMax,
    filterSqftMin,
    filterSqftMax,
    sortBy,
  ]);

  const hasActiveFilters = useMemo(() => {
    return (
      debouncedSearch.length > 0 ||
      dealTypeFilter !== 'all' ||
      filterBudgetMin.trim() !== '' ||
      filterBudgetMax.trim() !== '' ||
      filterSqftMin.trim() !== '' ||
      filterSqftMax.trim() !== '' ||
      sortBy !== 'newest'
    );
  }, [
    debouncedSearch,
    dealTypeFilter,
    filterBudgetMin,
    filterBudgetMax,
    filterSqftMin,
    filterSqftMax,
    sortBy,
  ]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (debouncedSearch.length > 0) n++;
    if (dealTypeFilter !== 'all') n++;
    if (filterBudgetMin.trim() !== '') n++;
    if (filterBudgetMax.trim() !== '') n++;
    if (filterSqftMin.trim() !== '') n++;
    if (filterSqftMax.trim() !== '') n++;
    if (sortBy !== 'newest') n++;
    return n;
  }, [
    debouncedSearch,
    dealTypeFilter,
    filterBudgetMin,
    filterBudgetMax,
    filterSqftMin,
    filterSqftMax,
    sortBy,
  ]);

  const clearBrowseFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setDealTypeFilter('all');
    setFilterBudgetMin('');
    setFilterBudgetMax('');
    setFilterSqftMin('');
    setFilterSqftMax('');
    setSortBy('newest');
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['marketing', 'listings', listingFilters],
    queryFn: () => marketingAPI.getListings(listingFilters),
  });

  const listings = data?.listings ?? [];

  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('location', location.trim());
      formData.append('dealType', dealType);
      formData.append('squareFootage', squareFootage);
      formData.append('priceMin', priceMin);
      formData.append('priceMax', priceMax);
      formData.append('estimatedArv', estimatedArv);
      formData.append('visibility', marketplaceVisibility);
      files.forEach((f) => formData.append('images', f));
      return marketingAPI.createListing(formData);
    },
    onSuccess: () => {
      toast.success('Listing published');
      setOpen(false);
      setLocation('');
      setDealType('wholesale');
      setSquareFootage('');
      setPriceMin('');
      setPriceMax('');
      setEstimatedArv('');
      setMarketplaceVisibility('visible');
      setFiles([]);
      queryClient.invalidateQueries({ queryKey: ['marketing'] });
    },
    onError: (e: Error & { response?: { data?: { error?: string } } }) => {
      toast.error(e.response?.data?.error || e.message || 'Failed to create listing');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length) {
      toast.error('Add at least one image');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEOHead
        title="Property marketing - NAREIS"
        description="Share deals and connect with members interested in your listings."
      />
      <Navigation />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-teal-700 to-emerald-700 text-white py-14">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              <Building2 className="h-9 w-9" />
              Property marketing
            </h1>
            <p className="text-lg text-teal-50 max-w-2xl">
              Post properties you want to sell. Members can signal interest; you&apos;ll see them on your dashboard.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Active listings</h2>
              <p className="text-muted-foreground text-sm">Member-to-member deal flow</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-teal-200 bg-white hover:bg-teal-50 text-teal-900 shrink-0"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" aria-hidden />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 h-5 min-w-[1.25rem] rounded-full px-1.5 tabular-nums bg-teal-600 text-white hover:bg-teal-600 border-0"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Filter listings</DialogTitle>
                    <DialogDescription>
                      Narrow by location, deal type, budget, size, and sort order. Changes apply as you adjust.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-1">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="browse-search" className="text-xs font-medium text-muted-foreground">
                          Location keywords
                        </Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                          <Input
                            id="browse-search"
                            placeholder="City, state, street…"
                            className="pl-9 h-10 border-teal-100 focus-visible:ring-teal-500"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">Deal type</Label>
                          <Select value={dealTypeFilter} onValueChange={setDealTypeFilter}>
                            <SelectTrigger className="h-10 border-teal-100">
                              <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All deal types</SelectItem>
                              {DEAL_TYPES.map((d) => (
                                <SelectItem key={d.value} value={d.value}>
                                  {d.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">Sort</Label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-10 border-teal-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newest">Newest first</SelectItem>
                              <SelectItem value="price_asc">Price: low to high</SelectItem>
                              <SelectItem value="price_desc">Price: high to low</SelectItem>
                              <SelectItem value="sqft_desc">Largest sq ft</SelectItem>
                              <SelectItem value="sqft_asc">Smallest sq ft</SelectItem>
                              <SelectItem value="interest_desc">Most interest</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="f-bmin" className="text-xs font-medium text-muted-foreground">
                          Min budget ($)
                        </Label>
                        <Input
                          id="f-bmin"
                          inputMode="numeric"
                          placeholder="Any"
                          className="h-10 border-teal-100"
                          value={filterBudgetMin}
                          onChange={(e) => setFilterBudgetMin(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="f-bmax" className="text-xs font-medium text-muted-foreground">
                          Max budget ($)
                        </Label>
                        <Input
                          id="f-bmax"
                          inputMode="numeric"
                          placeholder="Any"
                          className="h-10 border-teal-100"
                          value={filterBudgetMax}
                          onChange={(e) => setFilterBudgetMax(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="f-smin" className="text-xs font-medium text-muted-foreground">
                          Min sq ft
                        </Label>
                        <Input
                          id="f-smin"
                          inputMode="numeric"
                          placeholder="Any"
                          className="h-10 border-teal-100"
                          value={filterSqftMin}
                          onChange={(e) => setFilterSqftMin(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="f-smax" className="text-xs font-medium text-muted-foreground">
                          Max sq ft
                        </Label>
                        <Input
                          id="f-smax"
                          inputMode="numeric"
                          placeholder="Any"
                          className="h-10 border-teal-100"
                          value={filterSqftMax}
                          onChange={(e) => setFilterSqftMax(e.target.value)}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground border-t border-teal-100 pt-3">
                      <strong className="text-foreground">Budget</strong> finds listings whose asking range overlaps your range.{' '}
                      <strong className="text-foreground">Sq ft</strong> filters by property size.
                    </p>
                  </div>
                  <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        clearBrowseFilters();
                      }}
                      disabled={!hasActiveFilters}
                    >
                      Clear all
                    </Button>
                    <Button
                      type="button"
                      className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700"
                      onClick={() => setFilterOpen(false)}
                    >
                      Done
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-teal-600 hover:bg-teal-700 shrink-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Post a listing
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>New listing</DialogTitle>
                  <DialogDescription>
                    Add location, deal type, numbers, and at least one photo.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loc">Location</Label>
                    <Input
                      id="loc"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State or full address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Deal type</Label>
                    <Select value={dealType} onValueChange={setDealType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEAL_TYPES.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sqft">Square footage</Label>
                    <Input
                      id="sqft"
                      type="number"
                      min={0}
                      step={1}
                      value={squareFootage}
                      onChange={(e) => setSquareFootage(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="pmin">Price min ($)</Label>
                      <Input
                        id="pmin"
                        type="number"
                        min={0}
                        step={1}
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pmax">Price max ($)</Label>
                      <Input
                        id="pmax"
                        type="number"
                        min={0}
                        step={1}
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arv">Estimated ARV ($)</Label>
                    <Input
                      id="arv"
                      type="number"
                      min={0}
                      step={1}
                      value={estimatedArv}
                      onChange={(e) => setEstimatedArv(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Marketplace</Label>
                    <Select
                      value={marketplaceVisibility}
                      onValueChange={(v) => setMarketplaceVisibility(v as 'visible' | 'hidden')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visible">Shown on marketplace</SelectItem>
                        <SelectItem value="hidden">Hidden (dashboard only)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Hidden listings stay off the public list until you change this under My listings.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imgs">Images</Label>
                    <Input
                      id="imgs"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setFiles(Array.from(e.target.files || []))}
                      required
                    />
                    <p className="text-xs text-muted-foreground">At least one image required.</p>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Publishing…
                        </>
                      ) : (
                        'Publish'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-teal-200 bg-teal-50/80 px-4 py-3">
            <p className="text-sm text-teal-900">
              View only <strong>your</strong> listings and who is interested on the member dashboard-style page.
            </p>
            <Button
              type="button"
              variant="outline"
              className="shrink-0 border-teal-300 bg-white hover:bg-teal-50"
              onClick={() => navigate('/my-property-marketing')}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              My listings &amp; interest
            </Button>
          </div>
          {!isLoading && !error && (
            <p className="text-sm text-muted-foreground mb-4 tabular-nums">
              {listings.length === 1 ? '1 listing' : `${listings.length} listings`}
              {hasActiveFilters ? ' match your filters' : ' on the marketplace'}
            </p>
          )}

          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
            </div>
          )}
          {error && (
            <p className="text-center text-red-600 py-8">Could not load listings. Try again later.</p>
          )}
          {!isLoading && !error && listings.length === 0 && (
            <Card className="border-dashed border-teal-200/80 bg-teal-50/20">
              <CardContent className="py-12 text-center space-y-3">
                <p className="text-muted-foreground">
                  {hasActiveFilters
                    ? 'No listings match your filters. Try widening your budget or clearing filters.'
                    : 'No listings yet. Be the first to post a deal.'}
                </p>
                {hasActiveFilters && (
                  <Button type="button" variant="outline" className="border-teal-300" onClick={clearBrowseFilters}>
                    Clear filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                className="overflow-hidden border-0 shadow-lg flex flex-col hover:shadow-xl transition-shadow"
              >
                <Link to={`/property-marketing/${listing.id}`} className="block aspect-[4/3] bg-gray-200 relative shrink-0 group">
                  {listing.imageUrls[0] ? (
                    <img
                      src={getFileUrl(listing.imageUrls[0])}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/55 text-white text-xs font-medium px-2.5 py-1 backdrop-blur-sm">
                    <Users className="h-3.5 w-3.5" aria-hidden />
                    <span>
                      {(listing.interestCount ?? 0) === 0
                        ? 'No interest yet'
                        : `${listing.interestCount} interested`}
                    </span>
                  </div>
                </Link>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base leading-snug line-clamp-2">
                    <Link
                      to={`/property-marketing/${listing.id}`}
                      className="hover:text-teal-700 focus:outline-none focus:underline"
                    >
                      {listing.location}
                    </Link>
                  </CardTitle>
                  <CardDescription className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-teal-800 text-xs font-medium capitalize">
                      {listing.dealType.replace(/-/g, ' ')}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col pt-0">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Ruler className="h-3.5 w-3.5 shrink-0" />
                      {listing.squareFootage.toLocaleString()} sq ft
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 shrink-0" />
                      {formatMoney(listing.priceMin)} – {formatMoney(listing.priceMax)}
                    </div>
                    <div className="flex items-center gap-1.5 line-clamp-1">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      ARV {formatMoney(listing.estimatedArv)}
                    </div>
                    <div className="flex items-center gap-1.5 text-teal-800 font-medium pt-0.5">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      {(listing.interestCount ?? 0) === 0
                        ? 'Be the first to show interest'
                        : `${listing.interestCount} member${listing.interestCount === 1 ? '' : 's'} interested`}
                    </div>
                  </div>
                  <Button asChild className="w-full bg-teal-600 hover:bg-teal-700 mt-auto">
                    <Link to={`/property-marketing/${listing.id}`}>View details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
