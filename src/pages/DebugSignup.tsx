import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/ui/back-button';

export default function DebugSignup() {
  const { user, signUp, signOut } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testName, setTestName] = useState('Test User');
  const [testPassword, setTestPassword] = useState('test123456');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
  };

  const fetchCustomers = async () => {
    addLog('Fetching customers...');
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false }).limit(10);
    if (error) {
      addLog(`Error fetching customers: ${error.message}`);
    } else {
      addLog(`Found ${data?.length || 0} customers`);
      setCustomers(data || []);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleTestSignup = async () => {
    setLoading(true);
    addLog(`Starting signup for: ${testEmail}`);
    
    try {
      const { data, error } = await signUp(testEmail, testPassword, testName);
      
      if (error) {
        addLog(`Signup ERROR: ${error.message}`);
      } else if (data?.user) {
        addLog(`Signup SUCCESS - User ID: ${data.user.id}`);
        addLog(`Session: ${data.session ? 'YES' : 'NO'}`);
        
        // Wait a moment then refresh customers
        setTimeout(async () => {
          await fetchCustomers();
        }, 1000);
      }
    } catch (err: any) {
      addLog(`Signup EXCEPTION: ${err.message}`);
    }
    
    setLoading(false);
  };

  const handleCheckCustomer = async () => {
    addLog(`Checking for customer with email: ${testEmail}`);
    const { data, error } = await supabase.from('customers').select('*').eq('email', testEmail.toLowerCase()).single();
    
    if (error) {
      addLog(`Customer lookup error: ${error.message}`);
    } else if (data) {
      addLog(`Customer FOUND: ID=${data.id}, auth_id=${data.auth_id}`);
    } else {
      addLog('Customer NOT FOUND');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Signup Debug Tool</h1>
        
        <Card>
          <CardHeader><CardTitle>Current Auth State</CardTitle></CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <p><strong>Logged in as:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user.id}</p>
                <Button onClick={signOut} variant="outline">Sign Out</Button>
              </div>
            ) : (
              <p className="text-gray-500">Not logged in</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Test Signup</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Email" value={testEmail} onChange={e => setTestEmail(e.target.value)} />
            <Input placeholder="Full Name" value={testName} onChange={e => setTestName(e.target.value)} />
            <Input placeholder="Password" type="password" value={testPassword} onChange={e => setTestPassword(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={handleTestSignup} disabled={loading}>{loading ? 'Signing up...' : 'Test Signup'}</Button>
              <Button onClick={handleCheckCustomer} variant="outline">Check Customer</Button>
              <Button onClick={fetchCustomers} variant="outline">Refresh List</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Logs</CardTitle></CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-3 rounded font-mono text-xs h-48 overflow-y-auto">
              {logs.map((log, i) => <div key={i}>{log}</div>)}
              {logs.length === 0 && <span className="text-gray-500">No logs yet...</span>}
            </div>
            <Button onClick={() => setLogs([])} variant="ghost" size="sm" className="mt-2">Clear Logs</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Customers ({customers.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Auth ID</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id} className="border-b">
                      <td className="p-2">{c.email}</td>
                      <td className="p-2">{c.full_name}</td>
                      <td className="p-2 font-mono text-xs">{c.auth_id?.slice(0,8)}...</td>
                      <td className="p-2">{c.approval_status}</td>
                      <td className="p-2">{new Date(c.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
