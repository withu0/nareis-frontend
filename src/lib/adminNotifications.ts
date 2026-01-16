import { supabase } from './supabase';
import { emailService } from './emailService';

export const adminNotifications = {
  async checkPendingApplications() {
    try {
      // Get all pending applications older than 48 hours
      const twoDaysAgo = new Date();
      twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

      const { data: pendingApps, error } = await supabase
        .from('customers')
        .select('id, email, first_name, last_name, created_at')
        .eq('approval_status', 'pending')
        .lt('created_at', twoDaysAgo.toISOString());

      if (error) throw error;

      if (pendingApps && pendingApps.length > 0) {
        // Get admin users
        const { data: admins } = await supabase
          .from('customers')
          .select('email, first_name, last_name')
          .eq('role', 'admin');

        if (admins && admins.length > 0) {
          // Calculate days pending for each application
          const appsWithDays = pendingApps.map(app => {
            const created = new Date(app.created_at);
            const now = new Date();
            const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
            return {
              name: `${app.first_name} ${app.last_name}`,
              email: app.email,
              days
            };
          });

          // Send reminder to each admin
          for (const admin of admins) {
            await emailService.sendPendingApplicationReminder(
              admin.email,
              `${admin.first_name} ${admin.last_name}`,
              pendingApps.length,
              appsWithDays
            );
          }
        }
      }

      return { success: true, count: pendingApps?.length || 0 };
    } catch (error) {
      console.error('Error checking pending applications:', error);
      return { success: false, error };
    }
  }
};
