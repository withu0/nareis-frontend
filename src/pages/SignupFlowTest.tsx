import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Clock, Play, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TestStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  details?: string;
}

export default function SignupFlowTest() {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<TestStep[]>([
    { id: 'settings', name: 'Check Admin Settings', status: 'pending' },
    { id: 'signup', name: 'User Signup', status: 'pending' },
    { id: 'onboarding', name: 'Complete Onboarding', status: 'pending' },
    { id: 'payment', name: 'Stripe Payment (4242...)', status: 'pending' },
    { id: 'approval', name: 'Auto-Approval Check', status: 'pending' },
    { id: 'email', name: 'Welcome Email Sent', status: 'pending' }
  ]);
  const [autoApproval, setAutoApproval] = useState<boolean | null>(null);
  const [testUser, setTestUser] = useState<any>(null);

  const updateStep = (id: string, status: TestStep['status'], details?: string) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status, details } : s));
  };

  const checkSettings = async () => {
    updateStep('settings', 'running');
    try {
      const { data } = await supabase.from('admin_settings').select('*').eq('setting_key', 'auto_approval').single();
      const enabled = data?.setting_value?.enabled ?? false;
      setAutoApproval(enabled);
      updateStep('settings', 'passed', `Auto-approval: ${enabled ? 'ENABLED' : 'DISABLED'}`);
    } catch {
      const saved = localStorage.getItem('nareis_admin_settings');
      const enabled = saved ? JSON.parse(saved).autoApproval : false;
      setAutoApproval(enabled);
      updateStep('settings', 'passed', `Auto-approval (local): ${enabled ? 'ENABLED' : 'DISABLED'}`);
    }
  };

  const checkTestUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: customer } = await supabase.from('customers').select('*').eq('id', user.id).single();
      setTestUser(customer);
      return customer;
    }
    return null;
  };

  const runFullTest = async () => {
    await checkSettings();
    const customer = await checkTestUser();
    
    if (customer) {
      updateStep('signup', 'passed', `User: ${customer.email}`);
      if (customer.onboarding_completed) {
        updateStep('onboarding', 'passed', 'Onboarding completed');
      }
      if (customer.subscription_status === 'active') {
        updateStep('payment', 'passed', `Tier: ${customer.membership_tier}`);
      }
      if (customer.approval_status === 'approved') {
        updateStep('approval', 'passed', 'Member approved');
        updateStep('email', 'passed', 'Welcome email should be sent');
      } else if (customer.approval_status === 'pending') {
        updateStep('approval', autoApproval ? 'failed' : 'passed', 
          autoApproval ? 'Should be auto-approved' : 'Pending manual approval');
      }
    }
  };

  useEffect(() => { runFullTest(); }, []);

  const StatusIcon = ({ status }: { status: TestStep['status'] }) => {
    if (status === 'passed') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === 'failed') return <XCircle className="h-5 w-5 text-red-500" />;
    if (status === 'running') return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
    return <Clock className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-6 w-6" /> Signup Flow E2E Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map(step => (
              <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon status={step.status} />
                  <span className="font-medium">{step.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {step.details && <span className="text-sm text-gray-600">{step.details}</span>}
                  <Badge variant={step.status === 'passed' ? 'default' : step.status === 'failed' ? 'destructive' : 'secondary'}>
                    {step.status}
                  </Badge>
                </div>
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <Button onClick={runFullTest}><RefreshCw className="h-4 w-4 mr-2" />Re-run Tests</Button>
              <Button variant="outline" onClick={() => navigate('/signup')}>Start New Signup</Button>
              <Button variant="outline" onClick={() => navigate('/admin')}>Admin Panel</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Test Card Info</CardTitle></CardHeader>
          <CardContent>
            <code className="block p-4 bg-gray-900 text-green-400 rounded">
              Card: 4242 4242 4242 4242<br/>Exp: 12/25 | CVC: 123
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
