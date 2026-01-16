import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AdCreationFormProps {
  onSuccess: () => void;
  editAd?: any;
}

export function AdCreationForm({ onSuccess, editAd }: AdCreationFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    advertiser_name: editAd?.advertiser_name || '',
    advertiser_email: editAd?.advertiser_email || '',
    advertiser_company: editAd?.advertiser_company || '',
    ad_type: editAd?.ad_type || 'banner',
    placement: editAd?.placement || 'homepage_top',
    title: editAd?.title || '',
    description: editAd?.description || '',
    image_url: editAd?.image_url || '',
    link_url: editAd?.link_url || '',
    start_date: editAd?.start_date?.split('T')[0] || '',
    end_date: editAd?.end_date?.split('T')[0] || '',
    budget: editAd?.budget || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adData = {
        ...formData,
        budget: parseFloat(formData.budget),
        status: editAd ? editAd.status : 'pending',
      };

      if (editAd) {
        const { error } = await supabase
          .from('advertisements')
          .update(adData)
          .eq('id', editAd.id);
        if (error) throw error;
        toast({ title: 'Ad updated successfully' });
      } else {
        const { error } = await supabase
          .from('advertisements')
          .insert([adData]);
        if (error) throw error;
        toast({ title: 'Ad created successfully' });
      }
      
      onSuccess();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Advertiser Name</Label>
          <Input required value={formData.advertiser_name} onChange={(e) => setFormData({...formData, advertiser_name: e.target.value})} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" required value={formData.advertiser_email} onChange={(e) => setFormData({...formData, advertiser_email: e.target.value})} />
        </div>
      </div>
      <div>
        <Label>Company</Label>
        <Input value={formData.advertiser_company} onChange={(e) => setFormData({...formData, advertiser_company: e.target.value})} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Ad Type</Label>
          <Select value={formData.ad_type} onValueChange={(v) => setFormData({...formData, ad_type: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="banner">Banner</SelectItem>
              <SelectItem value="sidebar">Sidebar</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="sponsored">Sponsored</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Placement</Label>
          <Select value={formData.placement} onValueChange={(v) => setFormData({...formData, placement: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="homepage_top">Homepage Top</SelectItem>
              <SelectItem value="homepage_sidebar">Homepage Sidebar</SelectItem>
              <SelectItem value="dashboard_sidebar">Dashboard Sidebar</SelectItem>
              <SelectItem value="news_banner">News Banner</SelectItem>
              <SelectItem value="resources_featured">Resources Featured</SelectItem>
              <SelectItem value="events_sponsored">Events Sponsored</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Title</Label>
        <Input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
      </div>
      <div>
        <Label>Image URL</Label>
        <Input value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
      </div>
      <div>
        <Label>Link URL</Label>
        <Input required type="url" value={formData.link_url} onChange={(e) => setFormData({...formData, link_url: e.target.value})} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Input required type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} />
        </div>
        <div>
          <Label>End Date</Label>
          <Input required type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} />
        </div>
      </div>
      <div>
        <Label>Budget ($)</Label>
        <Input required type="number" step="0.01" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : editAd ? 'Update Ad' : 'Create Ad'}
      </Button>
    </form>
  );
}
