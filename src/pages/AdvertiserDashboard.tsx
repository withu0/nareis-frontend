import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateAdForm } from '@/components/advertiser/CreateAdForm';
import { Plus, TrendingUp, Eye, MousePointer, DollarSign, LogOut, BarChart3, User, CreditCard } from 'lucide-react';


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdvertiserDashboard() {
  const navigate = useNavigate();
  const [advertiser, setAdvertiser] = useState<any>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/advertiser/login');
      return;
    }
    
    const userRole = session.user?.user_metadata?.role;
    if (userRole !== 'advertiser') {
      toast.error('Access denied');
      navigate('/advertiser/login');
      return;
    }

    setAdvertiser({
      id: session.user.id,
      email: session.user.email,
      company_name: session.user.user_metadata?.company_name || 'Company',
      contact_name: session.user.user_metadata?.contact_name
    });
    loadAds();
  };

  const loadAds = async () => {
    const { data } = await supabase.from('advertisements').select('*').order('created_at', { ascending: false });
    setAds(data || []);
  };

  const handleCreateAd = async (adData: any) => {
    setLoading(true);
    try {
      await supabase.from('advertisements').insert([{
        ...adData, advertiser_name: advertiser.company_name, status: 'pending', impressions: 0, clicks: 0
      }]);
      toast.success('Advertisement submitted for review!');
      setCreateDialogOpen(false);
      loadAds();
    } catch (error) {
      toast.error('Failed to create advertisement');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/advertiser/login');
  };

  const stats = {
    total: ads.length,
    active: ads.filter(a => a.status === 'active').length,
    impressions: ads.reduce((sum, a) => sum + (a.impressions || 0), 0),
    clicks: ads.reduce((sum, a) => sum + (a.clicks || 0), 0),
    spent: ads.reduce((sum, a) => sum + (a.budget || 0), 0)
  };

  const ctr = stats.impressions > 0 ? ((stats.clicks / stats.impressions) * 100).toFixed(2) : '0.00';

  if (!advertiser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Advertiser Portal</h1>
            <p className="text-sm text-gray-600">{advertiser.company_name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate('/advertiser/billing')}>
              <CreditCard className="h-4 w-4 mr-2" />Billing
            </Button>
            <Button variant="ghost" onClick={() => navigate('/advertiser/profile')}>
              <User className="h-4 w-4 mr-2" />Profile
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Total Ads</p><p className="text-2xl font-bold">{stats.total}</p></div><TrendingUp className="h-8 w-8 text-blue-600" /></div></Card>
          <Card className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Impressions</p><p className="text-2xl font-bold">{stats.impressions.toLocaleString()}</p></div><Eye className="h-8 w-8 text-green-600" /></div></Card>
          <Card className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Clicks</p><p className="text-2xl font-bold">{stats.clicks.toLocaleString()}</p></div><MousePointer className="h-8 w-8 text-purple-600" /></div></Card>
          <Card className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">CTR</p><p className="text-2xl font-bold">{ctr}%</p></div><DollarSign className="h-8 w-8 text-orange-600" /></div></Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">My Campaigns</h2>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/advertiser/analytics')}><BarChart3 className="h-4 w-4 mr-2" />Advanced Analytics</Button>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Create Ad</Button></DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Create New Advertisement</DialogTitle></DialogHeader>
                <CreateAdForm onSubmit={handleCreateAd} loading={loading} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            {ads.map(ad => (
              <Card key={ad.id} className="p-6">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{ad.title}</h3>
                    <p className="text-sm text-gray-600">{ad.placement} • {ad.ad_type}</p>
                    <div className="flex gap-6 mt-4">
                      <div><p className="text-xs text-gray-500">Impressions</p><p className="font-semibold">{ad.impressions?.toLocaleString() || 0}</p></div>
                      <div><p className="text-xs text-gray-500">Clicks</p><p className="font-semibold">{ad.clicks?.toLocaleString() || 0}</p></div>
                      <div><p className="text-xs text-gray-500">CTR</p><p className="font-semibold">{ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0.00'}%</p></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${ad.status === 'active' ? 'bg-green-100 text-green-800' : ad.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{ad.status}</span>
                    <p className="text-sm text-gray-600 mt-2">Budget: ${ad.budget?.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
