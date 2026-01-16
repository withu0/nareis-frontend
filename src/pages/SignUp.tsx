import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupStatus, setSignupStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const tierData = location.state as { tierId?: string; tierName?: string; amount?: number; period?: string } | null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSignupStatus('idle');
    setStatusMessage('');

    try {
      console.log('=== SIGNUP STARTED ===');
      console.log('Email:', email);
      console.log('Full Name:', fullName);
      
      const { data, error } = await signUp(email, password, fullName);

      if (error) {
        console.error('Signup error:', error);
        setSignupStatus('error');
        setStatusMessage(error.message || 'Failed to create account');
        toast({ 
          title: 'Error', 
          description: error.message || 'Failed to create account. Please try again.', 
          variant: 'destructive' 
        });
      } else if (data?.user) {
        console.log('=== SIGNUP SUCCESS ===');
        console.log('User ID:', data.user.id);
        console.log('User Email:', data.user.email);
        
        setSignupStatus('success');
        setStatusMessage(`Account created! User ID: ${data.user.id}`);
        
        toast({ 
          title: 'Success', 
          description: 'Account created! Redirecting to complete your profile...' 
        });
        
        setTimeout(() => {
          navigate('/onboarding', { state: tierData });
        }, 1500);
      }
    } catch (err: any) {
      console.error('Signup exception:', err);
      setSignupStatus('error');
      setStatusMessage(err.message || 'An unexpected error occurred');
      toast({ 
        title: 'Error', 
        description: err.message || 'An unexpected error occurred. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            {tierData ? `Join as ${tierData.tierName}` : 'Join NAREIS.org and access exclusive member benefits'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {signupStatus === 'success' && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{statusMessage}</AlertDescription>
            </Alert>
          )}
          
          {signupStatus === 'error' && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{statusMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="John Smith"
                required 
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="john@example.com"
                required 
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Min 6 characters"
                required 
                minLength={6} 
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
          </div>
          
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
            <strong>Debug Info:</strong> Check browser console (F12) for detailed signup logs
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
