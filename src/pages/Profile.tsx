import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm';
import { CompanyDetailsForm } from '@/components/profile/CompanyDetailsForm';
import { ProfilePhotoUpload } from '@/components/profile/ProfilePhotoUpload';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { NotificationPreferences } from '@/components/profile/NotificationPreferences';
import { MemberBadgeDownload } from '@/components/profile/MemberBadgeDownload';
import SubscriptionManagement from '@/components/stripe/SubscriptionManagement';
import PaymentHistory from '@/components/stripe/PaymentHistory';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { userAPI, stripeAPI } from '@/lib/api';
import { toast } from 'sonner';
import { SEOHead } from '@/components/SEOHead';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { UserCircle2 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [membershipTier, setMembershipTier] = useState<string>('');
  const [isPaidMember, setIsPaidMember] = useState(false);

  // Handle upgrade success redirect from Stripe Checkout
  useEffect(() => {
    const upgrade = searchParams.get('upgrade');
    const sessionId = searchParams.get('session_id');
    const tier = searchParams.get('tier');
    if (upgrade === 'success' && sessionId && tier) {
      const verify = async () => {
        try {
          const res = await stripeAPI.verifyPayment(sessionId, tier);
          if (res.data?.success) {
            toast.success('Upgrade complete. Your plan has been updated.');
            setSearchParams({}, { replace: true });
          }
        } catch (e) {
          toast.error('Could not verify payment. Please contact support if your card was charged.');
        }
      };
      verify();
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (user) {
      const fetchMembershipStatus = async () => {
        try {
          const res = await userAPI.getSubscription();
          if (res.data) {
            const tier = res.data.membershipTier || 'Free';
            setMembershipTier(tier);
            setIsPaidMember(
              res.data.membershipStatus === 'active' ||
              ['professional', 'enterprise', 'founding', 'stakeholder', 'growth', 'foundation'].includes(tier)
            );
          }
        } catch {
          setMembershipTier('Free');
          setIsPaidMember(false);
        }
      };
      fetchMembershipStatus();
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  return (
    <DashboardLayout>
      <SEOHead
        title="Profile & settings - NAREIS"
        description="Manage your member profile, subscription, security, and notifications."
      />

      <div data-tour="profile-settings">
        <div className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="relative container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-100 flex items-center gap-3">
              <UserCircle2 className="h-9 w-9 shrink-0 opacity-95" />
              Profile &amp; settings
            </h1>
            <p className="text-teal-50 text-sm md:text-base font-medium max-w-2xl">
              Update your information, membership, password, and notification preferences.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1 h-auto p-1">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="photo">Photo</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="badges">Member Badges</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <PersonalInfoForm user={user} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Details</CardTitle>
                  <CardDescription>Update your company information</CardDescription>
                </CardHeader>
                <CardContent>
                  <CompanyDetailsForm user={user} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photo" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                  <CardDescription>Upload your profile picture</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfilePhotoUpload user={user} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="mt-6">
              <SubscriptionManagement />
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>View your payment transactions and invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentHistory />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="mt-6">
              <MemberBadgeDownload membershipTier={membershipTier} isPaidMember={isPaidMember} />
            </TabsContent>

            <TabsContent value="password" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChangePasswordForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage your email notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationPreferences user={user} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
