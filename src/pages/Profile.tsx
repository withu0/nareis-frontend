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
import { Navigate } from 'react-router-dom';
import { BackButton } from '@/components/ui/back-button';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';



export default function Profile() {
  const { user } = useAuth();
  const [membershipTier, setMembershipTier] = useState<string>('');
  const [isPaidMember, setIsPaidMember] = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch membership status from customers table
      const fetchMembershipStatus = async () => {
        const { data } = await supabase
          .from('customers')
          .select('membership_tier, subscription_status')
          .eq('id', user.id)
          .single();

        if (data) {
          setMembershipTier(data.membership_tier || 'Free');
          setIsPaidMember(
            data.subscription_status === 'active' || 
            ['professional', 'enterprise', 'founding-lifetime', 'service-partner'].includes(data.membership_tier || '')
          );
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
