import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Building2, Lock, Calendar, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';


export default function AdvertiserProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState('');
  
  const [profileData, setProfileData] = useState({
    company_name: '',
    contact_name: '',
    phone: '',
    website: '',
    billing_address: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    payment_success: true,
    payment_failed: true,
    invoice_generated: true,
    subscription_renewal: true,
    payment_method_expiring: true
  });


  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/advertiser-login');
      return;
    }

    setAccountCreated(new Date(user.created_at).toLocaleDateString());
    setProfileData({
      company_name: user.user_metadata.company_name || '',
      contact_name: user.user_metadata.contact_name || '',
      phone: user.user_metadata.phone || '',
      website: user.user_metadata.website || '',
      billing_address: user.user_metadata.billing_address || ''

    });

    setNotifications({
      payment_success: user.user_metadata.notify_payment_success ?? true,
      payment_failed: user.user_metadata.notify_payment_failed ?? true,
      invoice_generated: user.user_metadata.notify_invoice_generated ?? true,
      subscription_renewal: user.user_metadata.notify_subscription_renewal ?? true,
      payment_method_expiring: user.user_metadata.notify_payment_method_expiring ?? true
    });
  };


  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      data: profileData
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Profile updated successfully' });
    }
    setLoading(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Password updated successfully' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
    setLoading(false);

  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        notify_payment_success: notifications.payment_success,
        notify_payment_failed: notifications.payment_failed,
        notify_invoice_generated: notifications.invoice_generated,
        notify_subscription_renewal: notifications.subscription_renewal,
        notify_payment_method_expiring: notifications.payment_method_expiring
      }
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Notification preferences updated' });
    }
    setLoading(false);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate('/advertiser-dashboard')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-6">Advertiser Profile</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile"><Building2 className="mr-2 h-4 w-4" />Company Info</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Notifications</TabsTrigger>
            <TabsTrigger value="password"><Lock className="mr-2 h-4 w-4" />Password</TabsTrigger>
            <TabsTrigger value="account"><Calendar className="mr-2 h-4 w-4" />Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      value={profileData.company_name}
                      onChange={(e) => setProfileData({...profileData, company_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_name">Contact Name *</Label>
                    <Input
                      id="contact_name"
                      value={profileData.contact_name}
                      onChange={(e) => setProfileData({...profileData, contact_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://"
                      value={profileData.website}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="billing_address">Billing Address</Label>
                    <Input
                      id="billing_address"
                      value={profileData.billing_address}
                      onChange={(e) => setProfileData({...profileData, billing_address: e.target.value})}
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Email Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payment Successful</Label>
                    <p className="text-sm text-gray-500">Receive confirmation when payments are processed</p>
                  </div>
                  <Switch
                    checked={notifications.payment_success}
                    onCheckedChange={(checked) => setNotifications({...notifications, payment_success: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payment Failed</Label>
                    <p className="text-sm text-gray-500">Get notified when a payment fails</p>
                  </div>
                  <Switch
                    checked={notifications.payment_failed}
                    onCheckedChange={(checked) => setNotifications({...notifications, payment_failed: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Invoice Generated</Label>
                    <p className="text-sm text-gray-500">Receive new invoices via email</p>
                  </div>
                  <Switch
                    checked={notifications.invoice_generated}
                    onCheckedChange={(checked) => setNotifications({...notifications, invoice_generated: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Subscription Renewal</Label>
                    <p className="text-sm text-gray-500">Reminders before subscription renews</p>
                  </div>
                  <Switch
                    checked={notifications.subscription_renewal}
                    onCheckedChange={(checked) => setNotifications({...notifications, subscription_renewal: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payment Method Expiring</Label>
                    <p className="text-sm text-gray-500">Alert when payment method is about to expire</p>
                  </div>
                  <Switch
                    checked={notifications.payment_method_expiring}
                    onCheckedChange={(checked) => setNotifications({...notifications, payment_method_expiring: checked})}
                  />
                </div>
                <Button onClick={handleNotificationUpdate} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="newPassword">New Password *</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">Account Created</Label>
                    <p className="text-lg font-semibold">{accountCreated}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Account Type</Label>
                    <p className="text-lg font-semibold">Advertiser</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
