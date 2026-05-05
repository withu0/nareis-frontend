import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MemberDashboardAnalytics } from '@/components/dashboard/MemberDashboardAnalytics';
import PropertyMarketingInterestsCard from '@/components/dashboard/PropertyMarketingInterestsCard';

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.fullName || user?.email?.split('@')[0] || 'Member';

  return (
    <DashboardLayout>
      <SEOHead
        title="Member Dashboard - NAREIS"
        description="Your property marketing listings and interested members."
      />

      <div data-tour="dashboard">
        <div className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

          <div className="relative container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-100">
              Welcome back, {userName}!
            </h1>
            <p className="text-teal-50 text-sm md:text-base font-medium max-w-2xl">
              Track listing performance, community activity, and leads at a glance.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl space-y-10">
          <MemberDashboardAnalytics />
          <div className="max-w-3xl">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Listing activity</h2>
            <PropertyMarketingInterestsCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
