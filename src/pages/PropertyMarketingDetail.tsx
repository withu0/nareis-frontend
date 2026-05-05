import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigation } from '@/components/narei/Navigation';
import Footer from '@/components/narei/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { marketingAPI, getFileUrl } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Building2,
  ChevronLeft,
  DollarSign,
  LayoutDashboard,
  Loader2,
  MapPin,
  Ruler,
  Sparkles,
  Users,
  ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '@/components/SEOHead';

function formatMoney(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export default function PropertyMarketingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['marketing', 'listing', id],
    queryFn: () => marketingAPI.getListing(id!),
    enabled: Boolean(id),
  });

  const listing = data?.listing;
  const images = listing?.imageUrls ?? [];

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setCurrentSlide(carouselApi.selectedScrollSnap());
    onSelect();
    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [id, images.length]);

  const interestMutation = useMutation({
    mutationFn: () => marketingAPI.expressInterest(id!),
    onSuccess: () => {
      toast.success('Seller will see you in their dashboard');
      queryClient.invalidateQueries({ queryKey: ['marketing'] });
      if (id) queryClient.invalidateQueries({ queryKey: ['marketing', 'listing', id] });
    },
    onError: (e: Error & { response?: { data?: { error?: string } } }) => {
      toast.error(e.response?.data?.error || e.message || 'Could not record interest');
    },
  });

  const isOwn = listing && user?.id === listing.ownerId;
  const interestCount = listing?.interestCount ?? 0;

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
      <SEOHead
        title={listing ? `${listing.location} - Property marketing` : 'Listing - NAREIS'}
        description="Property listing details and express interest."
      />
      <Navigation />

      <main className="flex-1">
        {/* Slim top bar — listing sites keep nav light above media */}
        <div className="border-b border-neutral-200/80 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-neutral-700 -ml-2 gap-1"
              onClick={() => navigate('/property-marketing')}
            >
              <ChevronLeft className="h-4 w-4" />
              All listings
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => navigate('/my-property-marketing')}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              My listings
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-32">
            <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto px-4 py-20">
            <Card className="border-red-100 shadow-sm">
              <CardContent className="py-12 text-center space-y-4">
                <p className="text-destructive font-medium">This listing could not be loaded or is no longer available.</p>
                <Button asChild variant="outline">
                  <Link to="/property-marketing">Return to marketplace</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {!isLoading && !error && listing && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 pt-6 lg:pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_420px] gap-8 lg:gap-10 items-start">
              {/* —— Gallery column —— */}
              <div className="space-y-3 min-w-0">
                {images.length > 0 ? (
                  <>
                    <div className="relative rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl ring-1 ring-black/5">
                      <Carousel
                        setApi={setCarouselApi}
                        className="w-full"
                        opts={{ align: 'start', loop: images.length > 1 }}
                      >
                        <CarouselContent className="-ml-0">
                          {images.map((url, i) => (
                            <CarouselItem key={url + i} className="pl-0 basis-full">
                              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[2/1]">
                                <img
                                  src={getFileUrl(url)}
                                  alt={`${listing.location} — photo ${i + 1}`}
                                  className="absolute inset-0 w-full h-full object-cover"
                                  loading={i === 0 ? 'eager' : 'lazy'}
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {images.length > 1 && (
                          <>
                            <CarouselPrevious
                              className={cn(
                                'left-3 md:left-5 h-11 w-11 rounded-full border-0',
                                'bg-white/95 text-neutral-900 shadow-lg hover:bg-white',
                                'top-1/2 -translate-y-1/2'
                              )}
                            />
                            <CarouselNext
                              className={cn(
                                'right-3 md:right-5 h-11 w-11 rounded-full border-0',
                                'bg-white/95 text-neutral-900 shadow-lg hover:bg-white',
                                'top-1/2 -translate-y-1/2'
                              )}
                            />
                          </>
                        )}
                      </Carousel>

                      {/* Photo count + interest overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                        <span className="inline-flex items-center rounded-md bg-black/55 text-white text-xs font-medium px-2.5 py-1.5 backdrop-blur-md pointer-events-auto">
                          <ImageIcon className="h-3.5 w-3.5 mr-1.5 opacity-90" aria-hidden />
                          {currentSlide + 1} / {images.length}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-black/55 text-white text-xs font-medium px-2.5 py-1.5 backdrop-blur-md pointer-events-auto">
                          <Users className="h-3.5 w-3.5" aria-hidden />
                          {interestCount === 0 ? 'No interest yet' : `${interestCount} interested`}
                        </span>
                      </div>
                    </div>

                    {/* Thumbnails — desktop-style strip */}
                    {images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 pt-1">
                        {images.map((url, i) => (
                          <button
                            key={url + i}
                            type="button"
                            onClick={() => carouselApi?.scrollTo(i)}
                            className={cn(
                              'relative shrink-0 w-[88px] sm:w-24 h-[60px] sm:h-16 rounded-lg overflow-hidden ring-2 transition-all',
                              currentSlide === i
                                ? 'ring-teal-600 ring-offset-2 ring-offset-[#f7f7f7]'
                                : 'ring-transparent opacity-75 hover:opacity-100'
                            )}
                            aria-label={`Show photo ${i + 1}`}
                          >
                            <img src={getFileUrl(url)} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Dot indicators (mobile-friendly) */}
                    {images.length > 1 && (
                      <div className="flex justify-center gap-1.5 pt-1 lg:hidden">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => carouselApi?.scrollTo(i)}
                            className={cn(
                              'h-2 rounded-full transition-all',
                              currentSlide === i ? 'w-6 bg-teal-600' : 'w-2 bg-neutral-300'
                            )}
                            aria-label={`Go to slide ${i + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-2xl aspect-[16/10] bg-neutral-200 flex flex-col items-center justify-center text-neutral-500 gap-2">
                    <ImageIcon className="h-12 w-12 opacity-40" />
                    <span className="text-sm">No photos for this listing</span>
                  </div>
                )}

                {/* Secondary details card — below gallery on mobile order; mirrors sidebar info lightly */}
                <div className="lg:hidden rounded-xl border bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-neutral-900 flex items-start gap-2">
                    <Building2 className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{listing.location}</span>
                  </h2>
                  {listing.owner?.fullName && (
                    <p className="text-sm text-neutral-500 mt-2">Listed by {listing.owner.fullName}</p>
                  )}
                </div>
              </div>

              {/* —— Sticky sidebar —— */}
              <aside className="lg:sticky lg:top-24 space-y-5">
                <Card className="border-neutral-200/90 shadow-xl overflow-hidden">
                  <CardContent className="p-6 sm:p-7 space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                        Asking range
                      </p>
                      <p className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight tabular-nums">
                        {formatMoney(listing.priceMin)}
                        <span className="text-neutral-400 font-normal mx-1.5">–</span>
                        {formatMoney(listing.priceMax)}
                      </p>
                      <p className="text-sm text-neutral-600 mt-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                        Est. ARV {formatMoney(listing.estimatedArv)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-teal-50 text-teal-900 px-3 py-1 text-sm font-medium capitalize border border-teal-100">
                        {listing.dealType.replace(/-/g, ' ')}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 text-neutral-800 px-3 py-1 text-sm font-medium">
                        <Users className="h-3.5 w-3.5" />
                        {interestCount === 0
                          ? 'No interest yet'
                          : `${interestCount} member${interestCount === 1 ? '' : 's'} interested`}
                      </span>
                    </div>

                    <ul className="space-y-4 border-t border-neutral-100 pt-6">
                      <li className="flex gap-3">
                        <MapPin className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Location</p>
                          <p className="text-neutral-900 font-medium">{listing.location}</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <Ruler className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Size</p>
                          <p className="text-neutral-900 font-medium">
                            {listing.squareFootage.toLocaleString()} sq ft
                          </p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <DollarSign className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Price band</p>
                          <p className="text-neutral-900 font-medium">
                            {formatMoney(listing.priceMin)} – {formatMoney(listing.priceMax)}
                          </p>
                        </div>
                      </li>
                    </ul>

                    <div className="border-t border-neutral-100 pt-6">
                      {listing.owner && (
                        <div className="flex items-center gap-3 mb-5">
                          <Avatar className="h-11 w-11 border border-neutral-200">
                            {listing.owner.profilePictureUrl ? (
                              <AvatarImage src={getFileUrl(listing.owner.profilePictureUrl)} alt="" />
                            ) : null}
                            <AvatarFallback className="bg-teal-100 text-teal-800 text-sm font-semibold">
                              {(listing.owner.fullName || '?')[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs text-neutral-500 uppercase tracking-wide">Listed by</p>
                            <p className="font-semibold text-neutral-900">{listing.owner.fullName || 'Member'}</p>
                          </div>
                        </div>
                      )}

                      {isOwn ? (
                        <Button variant="secondary" disabled className="w-full h-12 text-base">
                          This is your listing
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          className="w-full h-12 text-base font-semibold bg-teal-600 hover:bg-teal-700 shadow-md"
                          onClick={() => interestMutation.mutate()}
                          disabled={interestMutation.isPending}
                        >
                          {interestMutation.isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            "I'm interested"
                          )}
                        </Button>
                      )}
                      <p className="text-xs text-neutral-500 text-center mt-3">
                        The seller is notified and can follow up in their dashboard.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>

            {/* Desktop title row — full width under hero for SEO / scan */}
            <div className="hidden lg:block mt-8 max-w-4xl">
              <h1 className="text-2xl xl:text-3xl font-bold text-neutral-900 tracking-tight flex items-start gap-3">
                <Building2 className="h-8 w-8 text-teal-600 shrink-0" />
                <span>{listing.location}</span>
              </h1>
              {listing.owner?.fullName && (
                <p className="text-neutral-600 mt-2 ml-11">Listed by {listing.owner.fullName}</p>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
