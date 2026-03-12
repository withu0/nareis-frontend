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
import { BackButton } from '@/components/ui/back-button';
import { useState, useEffect } from 'react';
import { userAPI, stripeAPI } from '@/lib/api';
import { toast } from 'sonner';

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
    <div className="container mx-auto px-4 py-12">
      <BackButton />
      

      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="photo">Photo</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="badges">Member Badges</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>


        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent><PersonalInfoForm user={user} /></CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>Update your company information</CardDescription>
            </CardHeader>
            <CardContent><CompanyDetailsForm user={user} /></CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="photo">
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Upload your profile picture</CardDescription>
            </CardHeader>
            <CardContent><ProfilePhotoUpload user={user} /></CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <SubscriptionManagement />
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View your payment transactions and invoices</CardDescription>
            </CardHeader>
            <CardContent><PaymentHistory /></CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="badges">
          <MemberBadgeDownload 
            membershipTier={membershipTier}
            isPaidMember={isPaidMember}
          />
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent><ChangePasswordForm /></CardContent>
          </Card>
        </TabsContent>


        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage your email notifications</CardDescription>
            </CardHeader>
            <CardContent><NotificationPreferences user={user} /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
