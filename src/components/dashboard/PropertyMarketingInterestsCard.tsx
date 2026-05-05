import { useQuery } from '@tanstack/react-query';
import { marketingAPI, getFileUrl } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ChevronRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function PropertyMarketingInterestsCard() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['marketing', 'my-listings'],
    queryFn: () => marketingAPI.getMyListings(),
  });

  const listings = data?.listings ?? [];
  const withInterest = listings.filter((l) => l.interests?.length > 0);
  const totalLeads = listings.reduce((sum, l) => sum + (l.interests?.length ?? 0), 0);

  if (isLoading) {
    return (
      <Card className="border-teal-100 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-teal-600" />
            Property marketing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading…</p>
        </CardContent>
      </Card>
    );
  }

  if (listings.length === 0) {
    return (
      <Card className="border-teal-100 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-teal-600" />
            Property marketing
          </CardTitle>
          <CardDescription>Post a deal and see who is interested.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full" onClick={() => navigate('/my-property-marketing')}>
              My listings page
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => navigate('/property-marketing')}>
              Post on marketplace
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-teal-100 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-teal-600" />
              Your listing leads
            </CardTitle>
            <CardDescription>
              {totalLeads === 0
                ? 'No interest yet on your posts.'
                : `${totalLeads} interested member${totalLeads === 1 ? '' : 's'} across your listings.`}
            </CardDescription>
          </div>
          <Button size="sm" variant="secondary" onClick={() => navigate('/my-property-marketing')}>
            Open
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {withInterest.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Members who click &quot;I&apos;m interested&quot; on your listings will appear here.
          </p>
        )}
        {withInterest.map((listing) => (
          <div key={listing.id} className="rounded-lg border bg-white/80 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-sm truncate">{listing.location}</p>
              <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                <Users className="h-3.5 w-3.5" />
                {listing.interests.length}
              </span>
            </div>
            <ul className="space-y-2">
              {listing.interests.slice(0, 5).map((row) => (
                <li key={row.id} className="flex items-center gap-2 text-sm">
                  <Avatar className="h-8 w-8">
                    {row.profilePictureUrl ? (
                      <AvatarImage src={getFileUrl(row.profilePictureUrl)} alt="" />
                    ) : null}
                    <AvatarFallback className="text-xs">
                      {(row.fullName || row.email || '?').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{row.fullName || 'Member'}</p>
                    <p className="text-xs text-muted-foreground truncate">{row.email}</p>
                  </div>
                </li>
              ))}
            </ul>
            {listing.interests.length > 5 && (
              <p className="text-xs text-muted-foreground">+{listing.interests.length - 5} more</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
