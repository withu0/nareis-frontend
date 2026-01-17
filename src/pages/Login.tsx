import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn(email, password);

    if (result.error) {
      toast({ title: 'Error', description: result.error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Logged in successfully!' });
      
      // Check if user is admin and redirect accordingly
      if (user?.role === 'admin' || ['admin@nareis.org', 'rick@theraisegroup.com'].includes(email.toLowerCase())) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
    setLoading(false);
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Member Login</CardTitle>
          <CardDescription>Sign in to access your member dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          



          <div className="mt-4 text-center text-sm space-y-2">
            <Link to="/reset-password" className="text-blue-600 hover:underline block">Forgot password?</Link>
            <div>Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
