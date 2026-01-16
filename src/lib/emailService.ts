import { supabase } from './supabase';
import { emailTemplates } from './emailTemplates';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export const emailService = {
  async sendEmail(options: EmailOptions) {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: options
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }
  },

  async sendWelcomeEmail(email: string, name: string, tier: string) {
    const loginUrl = `${window.location.origin}/login`;
    return this.sendEmail({
      to: email,
      subject: 'Welcome to NAREIS - Your Membership is Active!',
      html: emailTemplates.welcomeEmail(name, tier, loginUrl)
    });
  },

  async sendMembershipApproval(email: string, name: string, tier: string) {
    return this.sendEmail({
      to: email,
      subject: 'Your NAREI Membership Has Been Approved!',
      html: emailTemplates.membershipApproved(name, tier)
    });
  },

  async sendMembershipRejection(email: string, name: string, reason: string) {
    return this.sendEmail({
      to: email,
      subject: 'NAREI Membership Application Update',
      html: emailTemplates.membershipRejected(name, reason)
    });
  },

  async sendEventRegistration(email: string, name: string, eventName: string, eventDate: string) {
    return this.sendEmail({
      to: email,
      subject: `Event Registration Confirmed: ${eventName}`,
      html: emailTemplates.eventRegistration(name, eventName, eventDate)
    });
  },

  async sendPasswordReset(email: string, name: string, resetLink: string) {
    return this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: emailTemplates.passwordReset(name, resetLink)
    });
  },

  async sendBulkAnnouncement(emails: string[], subject: string, message: string) {
    return this.sendEmail({
      to: emails,
      subject,
      html: emailTemplates.adminAnnouncement(subject, message)
    });
  },

  async sendPendingApplicationReminder(
    adminEmail: string, 
    adminName: string, 
    pendingCount: number, 
    applications: Array<{name: string, email: string, days: number}>
  ) {
    return this.sendEmail({
      to: adminEmail,
      subject: `${pendingCount} Member Application(s) Pending Review`,
      html: emailTemplates.pendingApplicationReminder(adminName, pendingCount, applications)
    });
  },

  async sendNewSignupNotification(adminEmail: string, adminName: string, userName: string, userEmail: string) {
    return this.sendEmail({
      to: adminEmail,
      subject: 'New Member Application - Action Required',
      html: emailTemplates.newSignupNotification(adminName, userName, userEmail)
    });
  },

  async sendApplicationStatusUpdate(email: string, name: string, status: 'approved' | 'rejected', reason?: string) {
    return this.sendEmail({
      to: email,
      subject: status === 'approved' 
        ? 'Your NAREIS Membership Has Been Approved!' 
        : 'NAREIS Membership Application Update',
      html: emailTemplates.applicationStatusUpdate(name, status, reason)
    });
  },

  async sendFeaturedMemberRenewalReminder(
    email: string, 
    name: string, 
    companyName: string, 
    daysRemaining: number, 
    expirationDate: string, 
    renewalLink: string
  ) {
    return this.sendEmail({
      to: email,
      subject: `Action Required: Your Featured Membership Expires in ${daysRemaining} Days`,
      html: emailTemplates.featuredMemberRenewalReminder(name, companyName, daysRemaining, expirationDate, renewalLink)
    });
  },

  async sendFeaturedMemberExpired(email: string, name: string, companyName: string) {
    return this.sendEmail({
      to: email,
      subject: 'Your NAREIS Featured Membership Has Expired',
      html: emailTemplates.featuredMemberExpired(name, companyName)
    });
  },

  async sendFeaturedMemberRenewalConfirmation(email: string, name: string, companyName: string, newExpirationDate: string) {
    return this.sendEmail({
      to: email,
      subject: 'Featured Membership Renewed Successfully!',
      html: emailTemplates.featuredMemberRenewalConfirmation(name, companyName, newExpirationDate)
    });
  }
};
