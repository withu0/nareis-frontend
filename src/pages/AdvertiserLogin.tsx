import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function AdvertiserLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Check if user is an advertiser
      const userRole = data.user?.user_metadata?.role;
      if (userRole !== 'advertiser') {
        await supabase.auth.signOut();
        toast.error('This account is not an advertiser account');
        return;
      }

      toast.success('Login successful!');
      navigate('/advertiser/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold mb-2">Advertiser Login</h1>
        <p className="text-gray-600 mb-6">Sign in to manage your advertisements</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div>
            <Label>Password</Label>
            <Input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <p className="text-center text-sm">
            Don't have an account?{' '}
            <Button variant="link" onClick={() => navigate('/advertiser/signup')}>
              Sign Up
            </Button>
          </p>
        </form>
      </Card>
    </div>
  );
}
