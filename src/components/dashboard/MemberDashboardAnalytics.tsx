import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { marketingAPI, statisticsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Archive,
  Building2,
  CalendarDays,
  Sparkles,
  Store,
  Users,
  UsersRound,
} from 'lucide-react';
import { format } from 'date-fns';

function formatTier(tier: string | undefined) {
  if (!tier) return 'Member';
  return tier
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function MemberDashboardAnalytics() {
  const { user } = useAuth();

  const listingsQuery = useQuery({
    queryKey: ['marketing', 'my-listings'],
    queryFn: () => marketingAPI.getMyListings(),
  });

  const statsQuery = useQuery({
    queryKey: ['statistics', 'public'],
    queryFn: () => statisticsAPI.getPublicStats(),
  });

  const listingMetrics = useMemo(() => {
    const listings = listingsQuery.data?.listings ?? [];
    const active = listings.filter((l) => l.status === 'active').length;
    const archived = listings.filter((l) => l.status === 'archived').length;
    const leads = listings.reduce((sum, l) => sum + (l.interests?.length ?? 0), 0);
    return {
      total: listings.length,
      active,
      archived,
      leads,
    };
  }, [listingsQuery.data?.listings]);

  const community = statsQuery.data?.data;
  const renewal =
    user?.membershipExpiresAt != null
      ? format(new Date(user.membershipExpiresAt), 'MMM d, yyyy')
      : null;

  const loading = listingsQuery.isLoading || statsQuery.isLoading;

  const items = [
    {
      label: 'My listings',
      value: listingMetrics.total,
      hint: 'Properties you manage',
      icon: Building2,
      accent: 'from-teal-500/15 to-emerald-500/10 text-teal-700 border-teal-200/60',
      iconBg: 'bg-teal-500/15 text-teal-600',
    },
    {
      label: 'On marketplace',
      value: listingMetrics.active,
      hint: 'Visible to members',
      icon: Store,
      accent: 'from-emerald-500/15 to-cyan-500/10 text-emerald-800 border-emerald-200/60',
      iconBg: 'bg-emerald-500/15 text-emerald-600',
    },
    {
      label: 'Lead interest',
      value: listingMetrics.leads,
      hint: '“I’m interested” total',
      icon: Users,
      accent: 'from-cyan-500/15 to-blue-500/10 text-cyan-900 border-cyan-200/60',
      iconBg: 'bg-cyan-500/15 text-cyan-700',
    },
    {
      label: 'Archived',
      value: listingMetrics.archived,
      hint: 'Hidden from browse',
      icon: Archive,
      accent: 'from-slate-500/10 to-slate-500/5 text-slate-800 border-slate-200/80',
      iconBg: 'bg-slate-500/10 text-slate-600',
    },
    {
      label: 'Upcoming events',
      value: community?.upcomingEvents ?? '—',
      hint: 'Across NAREIS',
      icon: CalendarDays,
      accent: 'from-violet-500/12 to-fuchsia-500/8 text-violet-900 border-violet-200/50',
      iconBg: 'bg-violet-500/12 text-violet-700',
    },
    {
      label: 'Member network',
      value:
        typeof community?.activeMembers === 'number'
          ? community.activeMembers.toLocaleString()
          : '—',
      hint: 'Approved members',
      icon: UsersRound,
      accent: 'from-amber-500/12 to-orange-500/8 text-amber-950 border-amber-200/60',
      iconBg: 'bg-amber-500/12 text-amber-800',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Overview</h2>
          <p className="text-sm text-muted-foreground">
            Live metrics from your listings and the wider NAREIS community.
          </p>
        </div>
        {user?.membershipTier && (
          <div className="flex items-center gap-2 rounded-xl border bg-card/80 px-3 py-2 text-sm shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
            <div className="leading-tight">
              <p className="font-medium text-foreground">{formatTier(user.membershipTier)}</p>
              <p className="text-xs text-muted-foreground">
                {renewal ? `Renews ${renewal}` : 'Membership'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-md">
                <CardContent className="p-4 md:p-5 space-y-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))
          : items.map((item) => (
              <Card
                key={item.label}
                className={`group relative overflow-hidden border bg-gradient-to-br ${item.accent} shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
              >
                <CardContent className="p-4 md:p-5">
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}
                  >
                    <item.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90">
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl md:text-3xl font-bold tabular-nums tracking-tight text-foreground">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground leading-snug">{item.hint}</p>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
