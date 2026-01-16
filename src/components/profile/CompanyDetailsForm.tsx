import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export function CompanyDetailsForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: user?.user_metadata?.company || '',
    position: user?.user_metadata?.position || '',
    website: user?.user_metadata?.website || '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      data: { company: formData.company, position: formData.position, website: formData.website }
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Company details updated successfully' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="company">Company Name</Label>
        <Input id="company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
      </div>
      <div>
        <Label htmlFor="position">Position/Title</Label>
        <Input id="position" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
      </div>
      <div>
        <Label htmlFor="website">Company Website</Label>
        <Input id="website" type="url" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
    </form>
  );
}
