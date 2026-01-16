import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function AdvertiserSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    password: '',
    contact_name: '',
    phone: '',
    website: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'advertiser',
            company_name: formData.company_name,
            contact_name: formData.contact_name,
            phone: formData.phone,
            website: formData.website
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Account created successfully!');
        navigate('/advertiser/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Advertiser Portal</h1>
        <p className="text-gray-600 mb-6">Create your account to start advertising</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Company Name *</Label>
              <Input required value={formData.company_name} 
                onChange={e => setFormData({...formData, company_name: e.target.value})} />
            </div>
            <div>
              <Label>Contact Name *</Label>
              <Input required value={formData.contact_name}
                onChange={e => setFormData({...formData, contact_name: e.target.value})} />
            </div>
          </div>

          <div>
            <Label>Email *</Label>
            <Input type="email" required value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div>
            <Label>Password *</Label>
            <Input type="password" required minLength={6} value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <Label>Website</Label>
              <Input value={formData.website}
                onChange={e => setFormData({...formData, website: e.target.value})} />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <p className="text-center text-sm">
            Already have an account?{' '}
            <Button variant="link" onClick={() => navigate('/advertiser/login')}>
              Sign In
            </Button>
          </p>
        </form>
      </Card>
    </div>
  );
}
