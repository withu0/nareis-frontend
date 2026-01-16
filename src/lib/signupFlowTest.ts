import { supabase } from './supabase';

export interface TestResult {
  step: string;
  passed: boolean;
  details: string;
  timestamp: Date;
}

export const signupFlowTestUtils = {
  // Check if admin settings are configured
  async checkAdminSettings(): Promise<TestResult> {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('setting_key', 'auto_approval')
        .single();

      if (error) {
        // Try localStorage fallback
        const saved = localStorage.getItem('nareis_admin_settings');
        if (saved) {
          const settings = JSON.parse(saved);
          return {
            step: 'Admin Settings',
            passed: true,
            details: `Auto-approval: ${settings.autoApproval ? 'ENABLED' : 'DISABLED'} (localStorage)`,
            timestamp: new Date()
          };
        }
        throw error;
      }

      return {
        step: 'Admin Settings',
        passed: true,
        details: `Auto-approval: ${data?.setting_value?.enabled ? 'ENABLED' : 'DISABLED'}`,
        timestamp: new Date()
      };
    } catch (err: any) {
      return {
        step: 'Admin Settings',
        passed: false,
        details: `Error: ${err.message}`,
        timestamp: new Date()
      };
    }
  },

  // Check current user status
  async checkUserStatus(): Promise<TestResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { step: 'User Status', passed: false, details: 'No user logged in', timestamp: new Date() };
      }

      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!customer) {
        return { step: 'User Status', passed: false, details: 'No customer record', timestamp: new Date() };
      }

      return {
        step: 'User Status',
        passed: true,
        details: `Email: ${customer.email}, Tier: ${customer.membership_tier}, Approval: ${customer.approval_status}, Subscription: ${customer.subscription_status}`,
        timestamp: new Date()
      };
    } catch (err: any) {
      return { step: 'User Status', passed: false, details: err.message, timestamp: new Date() };
    }
  },

  // Verify auto-approval worked
  async verifyAutoApproval(): Promise<TestResult> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { step: 'Auto-Approval', passed: false, details: 'No user', timestamp: new Date() };
    }

    const { data: customer } = await supabase
      .from('customers')
      .select('approval_status, subscription_status')
      .eq('id', user.id)
      .single();

    if (customer?.approval_status === 'approved' && customer?.subscription_status === 'active') {
      return { step: 'Auto-Approval', passed: true, details: 'Member auto-approved successfully', timestamp: new Date() };
    }

    return {
      step: 'Auto-Approval',
      passed: false,
      details: `Status: ${customer?.approval_status}, Subscription: ${customer?.subscription_status}`,
      timestamp: new Date()
    };
  },

  // Generate test email
  generateTestEmail(): string {
    const timestamp = Date.now();
    return `test+${timestamp}@nareis-test.com`;
  }
};
