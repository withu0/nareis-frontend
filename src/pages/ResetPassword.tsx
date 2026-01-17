import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [reset, setReset] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // If token exists, show reset form; otherwise show email form
  useEffect(() => {
    if (token) {
      setReset(true);
    }
  }, [token]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Password reset email sent! Check your inbox.' });
        setSent(true);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to send reset email', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    if (password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.resetPassword(token!, password);
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Password reset successfully! Redirecting to login...' });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to reset password', variant: 'destructive' });
    }
    setLoading(false);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            {reset ? 'Enter your new password' : 'Enter your email to receive a password reset link'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reset ? (
            // Reset password form
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  minLength={6}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          ) : !sent ? (
            // Email form
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-green-600 mb-4">Check your email for the reset link!</p>
            </div>
          )}
          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="text-blue-600 hover:underline">Back to login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
