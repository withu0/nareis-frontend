export const emailTemplates = {
  welcomeEmail: (name: string, tier: string, loginUrl: string) => `
    <!DOCTYPE html>
    <html>
      <head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
      .header{background:linear-gradient(135deg,#2563eb,#7c3aed);color:white;padding:30px;text-align:center;border-radius:8px 8px 0 0}
      .content{padding:30px;background:#f9fafb}.highlight{background:#e0f2fe;padding:20px;border-radius:8px;margin:20px 0}
      .button{display:inline-block;padding:14px 28px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;margin:20px 0;font-weight:bold}
      .benefits{background:white;padding:20px;border-radius:8px;margin:20px 0}.benefits li{margin:10px 0}
      .footer{padding:20px;text-align:center;color:#666;font-size:12px;background:#f3f4f6;border-radius:0 0 8px 8px}</style></head>
      <body><div class="header"><h1>Welcome to NAREIS!</h1><p>Your membership is now active</p></div>
      <div class="content"><p>Dear ${name},</p>
      <p>Congratulations! Your <strong>${tier}</strong> membership has been approved and your account is now fully active.</p>
      <div class="highlight"><h3>Your Next Steps:</h3>
      <ol><li><strong>Log in</strong> to your member dashboard</li>
      <li><strong>Complete your profile</strong> to connect with other members</li>
      <li><strong>Explore resources</strong> in our member library</li>
      <li><strong>Join upcoming events</strong> and networking opportunities</li></ol></div>
      <a href="${loginUrl}" class="button">Access Your Dashboard</a>
      <div class="benefits"><h3>Your ${tier} Benefits Include:</h3>
      <ul><li>Access to exclusive member resources and guides</li>
      <li>Networking events and chapter meetings</li>
      <li>Industry advocacy and legislative updates</li>
      <li>Professional development opportunities</li>
      <li>Member directory access</li></ul></div>
      <p>If you have any questions, our support team is here to help.</p>
      <p>Welcome to the community!</p><p>The NAREIS Team</p></div>
      <div class="footer"><p>© 2025 NAREIS.org. All rights reserved.</p>
      <p><a href="https://nareis.org/contact">Contact Support</a> | <a href="https://nareis.org/privacy">Privacy Policy</a></p></div></body></html>`,

  membershipApproved: (name: string, tier: string) => `
    <!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
    .header{background:#2563eb;color:white;padding:20px;text-align:center}.content{padding:20px;background:#f9fafb}
    .button{display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;margin:20px 0}
    .footer{padding:20px;text-align:center;color:#666;font-size:12px}</style></head>
    <body><div class="header"><h1>Welcome to NAREIS.org!</h1></div>
    <div class="content"><p>Dear ${name},</p>
    <p>Congratulations! Your ${tier} membership application has been approved.</p>
    <p>You now have access to all member benefits including networking events, resources, and advocacy support.</p>
    <a href="https://nareis.org/dashboard" class="button">Access Your Dashboard</a>
    <p>Thank you for joining the National Association of Real Estate Investors.</p></div>
    <div class="footer"><p>© 2025 NAREIS.org. All rights reserved.</p></div></body></html>`,

  membershipRejected: (name: string, reason: string) => `
    <!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
    .header{background:#dc2626;color:white;padding:20px;text-align:center}.content{padding:20px;background:#f9fafb}
    .footer{padding:20px;text-align:center;color:#666;font-size:12px}</style></head>
    <body><div class="header"><h1>Membership Application Update</h1></div>
    <div class="content"><p>Dear ${name},</p>
    <p>Thank you for your interest in NAREIS.org membership. After careful review, we are unable to approve your application at this time.</p>
    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    <p>You may reapply after addressing the concerns noted above.</p></div>
    <div class="footer"><p>© 2025 NAREIS.org. All rights reserved.</p></div></body></html>`,

  eventRegistration: (name: string, eventName: string, eventDate: string) => `
    <!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
    .header{background:#059669;color:white;padding:20px;text-align:center}.content{padding:20px;background:#f9fafb}
    .button{display:inline-block;padding:12px 24px;background:#059669;color:white;text-decoration:none;border-radius:6px;margin:20px 0}
    .footer{padding:20px;text-align:center;color:#666;font-size:12px}</style></head>
    <body><div class="header"><h1>Event Registration Confirmed</h1></div>
    <div class="content"><p>Dear ${name},</p><p>You're registered for: <strong>${eventName}</strong></p>
    <p><strong>Date:</strong> ${eventDate}</p><p>We look forward to seeing you there!</p>
    <a href="https://nareis.org/events" class="button">View Event Details</a></div>
    <div class="footer"><p>© 2025 NAREIS.org. All rights reserved.</p></div></body></html>`,

  passwordReset: (name: string, resetLink: string) => `
    <!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
    .header{background:#7c3aed;color:white;padding:20px;text-align:center}.content{padding:20px;background:#f9fafb}
    .button{display:inline-block;padding:12px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:6px;margin:20px 0}
    .footer{padding:20px;text-align:center;color:#666;font-size:12px}</style></head>
    <body><div class="header"><h1>Password Reset Request</h1></div>
    <div class="content"><p>Dear ${name},</p><p>We received a request to reset your password. Click the button below:</p>
    <a href="${resetLink}" class="button">Reset Password</a><p>If you didn't request this, please ignore this email.</p>
    <p>This link expires in 24 hours.</p></div>
    <div class="footer"><p>© 2025 NAREIS.org. All rights reserved.</p></div></body></html>`,

  adminAnnouncement: (subject: string, message: string) => `
    <!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
    .header{background:#2563eb;color:white;padding:20px;text-align:center}.content{padding:20px;background:#f9fafb}
    .footer{padding:20px;text-align:center;color:#666;font-size:12px}</style></head>
    <body><div class="header"><h1>${subject}</h1></div><div class="content">${message}</div>
    <div class="footer"><p>© 2025 NAREIS.org. All rights reserved.</p></div></body></html>`,

  pendingApplicationReminder: (adminName: string, pendingCount: number, applications: Array<{name: string, email: string, days: number}>) => `
    <!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
    .header{background:#f59e0b;color:white;padding:20px;text-align:center}.content{padding:20px;background:#f9fafb}
    .button{display:inline-block;padding:12px 24px;background:#f59e0b;color:white;text-decoration:none;border-radius:6px;margin:20px 0}
    .app-list{background:white;padding:15px;border-left:4px solid #f59e0b;margin:15px 0}
    .footer{padding:20px;text-align:center;color:#666;font-size:12px}</style></head>
    <body><div class="header"><h1>Pending Member Applications</h1></div>
    <div class="content"><p>Dear ${adminName},</p><p>You have <strong>${pendingCount}</strong> application(s) pending review:</p>
    ${applications.map(app => `<div class="app-list"><strong>${app.name}</strong> (${app.email})<br><small>Pending for ${app.days} days</small></div>`).join('')}
    <a href="https://nareis.org/admin/approval-queue" class="button">Review Applications</a></div>
    <div class="footer"><p>© 2025 NAREIS.org. All rights reserved.</p></div></body></html>`,

  newSignupNotification: (adminName: string, userName: string, userEmail: string) => `
    <!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
    .header{background:#10b981;color:white;padding:20px;text-align:center}.content{padding:20px;background:#f9fafb}
    .button{display:inline-block;padding:12px 24px;background:#10b981;color:white;text-decoration:none;border-radius:6px;margin:20px 0}
    .info-box{background:white;padding:15px;border-left:4px solid #10b981;margin:15px 0}
    .footer{padding:20px;text-align:center;color:#666;font-size:12px}</style></head>
    <body><div class="header"><h1>New Member Application</h1></div>
    <div class="content"><p>Dear ${adminName},</p><p>A new member has signed up:</p>
    <div class="info-box"><strong>Name:</strong> ${userName}<br><strong>Email:</strong> ${userEmail}<br><strong>Status:</strong> Pending Approval</div>
    <a href="https://nareis.org/admin/approval-queue" class="button">Review Application</a></div>
    <div class="footer"><p>© 2025 NAREIS.org. All rights reserved.</p></div></body></html>`,

  applicationStatusUpdate: (name: string, status: 'approved' | 'rejected', reason?: string) => `
    <!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
    .header{background:${status === 'approved' ? '#10b981' : '#ef4444'};color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0}
    .content{padding:30px;background:#f9fafb}.info-box{background:white;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid ${status === 'approved' ? '#10b981' : '#ef4444'}}
    .button{display:inline-block;padding:14px 28px;background:${status === 'approved' ? '#10b981' : '#6b7280'};color:white;text-decoration:none;border-radius:8px;margin:20px 0;font-weight:bold}
    .footer{padding:20px;text-align:center;color:#666;font-size:12px;background:#f3f4f6;border-radius:0 0 8px 8px}</style></head>
    <body><div class="header"><h1>Membership Application ${status === 'approved' ? 'Approved' : 'Update'}</h1></div>
    <div class="content"><p>Dear ${name},</p>
    ${status === 'approved' ? `
    <p>Great news! Your NAREIS membership application has been <strong>approved</strong>.</p>
    <div class="info-box">
      <h3>What's Next?</h3>
      <ul>
        <li>Log in to your member dashboard</li>
        <li>Complete your profile</li>
        <li>Explore member resources and benefits</li>
        <li>Connect with other members in your area</li>
      </ul>
    </div>
    <a href="https://nareis.org/dashboard" class="button">Access Your Dashboard</a>
    <p>Welcome to the NAREIS community! We're excited to have you as a member.</p>
    ` : `
    <p>Thank you for your interest in NAREIS membership. After careful review, we are unable to approve your application at this time.</p>
    ${reason ? `<div class="info-box"><strong>Reason:</strong> ${reason}</div>` : ''}
    <p>If you believe this decision was made in error or would like to provide additional information, please contact our membership team.</p>
    <a href="https://nareis.org/contact" class="button">Contact Support</a>
    `}
    <p>Best regards,<br>The NAREIS Membership Team</p></div>
    <div class="footer"><p>© 2025 NAREIS.org. All rights reserved.</p>
    <p><a href="https://nareis.org/contact">Contact Support</a> | <a href="https://nareis.org/privacy">Privacy Policy</a></p></div></body></html>`,


  featuredMemberRenewalReminder: (name: string, companyName: string, daysRemaining: number, expirationDate: string, renewalLink: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
          .header{background:linear-gradient(135deg,#f59e0b,#d97706);color:white;padding:30px;text-align:center;border-radius:8px 8px 0 0}
          .content{padding:30px;background:#f9fafb}
          .warning-box{background:#fef3c7;border:2px solid #f59e0b;padding:20px;border-radius:8px;margin:20px 0;text-align:center}
          .warning-box h3{color:#d97706;margin:0 0 10px 0}
          .details-box{background:white;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #f59e0b}
          .button{display:inline-block;padding:16px 32px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;margin:20px 0;font-weight:bold;font-size:16px}
          .benefits{background:white;padding:20px;border-radius:8px;margin:20px 0}
          .benefits li{margin:10px 0}
          .price-box{background:#dcfce7;border:2px solid #22c55e;padding:15px;border-radius:8px;text-align:center;margin:20px 0}
          .footer{padding:20px;text-align:center;color:#666;font-size:12px;background:#f3f4f6;border-radius:0 0 8px 8px}
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Featured Membership Expiring Soon</h1>
          <p>Action Required</p>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          
          <div class="warning-box">
            <h3>Your Featured Membership Expires in ${daysRemaining} Days!</h3>
            <p style="margin:0;font-size:14px">Expiration Date: <strong>${expirationDate}</strong></p>
          </div>
          
          <p>Your featured placement for <strong>${companyName}</strong> on NAREIS.org is about to expire. Don't lose your premium visibility!</p>
          
          <div class="details-box">
            <h4 style="margin-top:0">Current Placement Details:</h4>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Expires:</strong> ${expirationDate}</p>
            <p><strong>Days Remaining:</strong> ${daysRemaining}</p>
          </div>
          
          <div class="benefits">
            <h4>Continue Enjoying These Benefits:</h4>
            <ul>
              <li>Prominent logo placement on the NAREIS homepage</li>
              <li>Direct link to your website for increased traffic</li>
              <li>Enhanced visibility in the member directory</li>
              <li>Priority placement in search results</li>
            </ul>
          </div>
          
          <div class="price-box">
            <p style="margin:0;font-size:18px;font-weight:bold">Renew for only $300</p>
            <p style="margin:5px 0 0 0;font-size:14px">Another 30 days of premium visibility</p>
          </div>
          
          <div style="text-align:center">
            <a href="${renewalLink}" class="button">Renew Now - $300</a>
          </div>
          
          <p style="font-size:14px;color:#666">If you do not renew by ${expirationDate}, your listing will be automatically removed from the featured section.</p>
          
          <p>Thank you for being a valued NAREIS member!</p>
          <p>Best regards,<br>The NAREIS Team</p>
        </div>
        <div class="footer">
          <p>© 2025 NAREIS.org. All rights reserved.</p>
          <p><a href="https://nareis.org/contact">Contact Support</a> | <a href="https://nareis.org/privacy">Privacy Policy</a></p>
        </div>
      </body>
    </html>`,

  featuredMemberExpired: (name: string, companyName: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
          .header{background:#6b7280;color:white;padding:30px;text-align:center;border-radius:8px 8px 0 0}
          .content{padding:30px;background:#f9fafb}
          .info-box{background:white;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #6b7280}
          .button{display:inline-block;padding:16px 32px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;margin:20px 0;font-weight:bold}
          .footer{padding:20px;text-align:center;color:#666;font-size:12px;background:#f3f4f6;border-radius:0 0 8px 8px}
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Featured Membership Expired</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          
          <p>Your featured membership placement for <strong>${companyName}</strong> on NAREIS.org has expired and your listing has been removed from the featured section.</p>
          
          <div class="info-box">
            <h4 style="margin-top:0">What This Means:</h4>
            <ul>
              <li>Your company logo is no longer displayed in the Featured Members section</li>
              <li>Your enhanced directory visibility has been reset</li>
              <li>Your priority search placement has ended</li>
            </ul>
          </div>
          
          <p>Want to regain your premium visibility? You can purchase a new featured membership placement at any time.</p>
          
          <div style="text-align:center">
            <a href="https://nareis.org/?featured=true" class="button">Get Featured Again - $300</a>
          </div>
          
          <p>If you have any questions about your membership, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>The NAREIS Team</p>
        </div>
        <div class="footer">
          <p>© 2025 NAREIS.org. All rights reserved.</p>
          <p><a href="https://nareis.org/contact">Contact Support</a> | <a href="https://nareis.org/privacy">Privacy Policy</a></p>
        </div>
      </body>
    </html>`,

  featuredMemberRenewalConfirmation: (name: string, companyName: string, newExpirationDate: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
          .header{background:linear-gradient(135deg,#22c55e,#16a34a);color:white;padding:30px;text-align:center;border-radius:8px 8px 0 0}
          .content{padding:30px;background:#f9fafb}
          .success-box{background:#dcfce7;border:2px solid #22c55e;padding:20px;border-radius:8px;margin:20px 0;text-align:center}
          .details-box{background:white;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #22c55e}
          .button{display:inline-block;padding:14px 28px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;margin:20px 0;font-weight:bold}
          .footer{padding:20px;text-align:center;color:#666;font-size:12px;background:#f3f4f6;border-radius:0 0 8px 8px}
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Renewal Confirmed!</h1>
          <p>Your Featured Membership Has Been Extended</p>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          
          <div class="success-box">
            <h3 style="color:#16a34a;margin:0">Payment Successful!</h3>
            <p style="margin:10px 0 0 0">Your featured membership has been renewed.</p>
          </div>
          
          <div class="details-box">
            <h4 style="margin-top:0">Renewal Details:</h4>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Amount Paid:</strong> $300.00</p>
            <p><strong>New Expiration Date:</strong> ${newExpirationDate}</p>
            <p><strong>Duration:</strong> 30 days</p>
          </div>
          
          <p>Your company will continue to be featured prominently on NAREIS.org. Thank you for your continued support!</p>
          
          <div style="text-align:center">
            <a href="https://nareis.org/dashboard" class="button">View Your Dashboard</a>
          </div>
          
          <p>Best regards,<br>The NAREIS Team</p>
        </div>
        <div class="footer">
          <p>© 2025 NAREIS.org. All rights reserved.</p>
          <p><a href="https://nareis.org/contact">Contact Support</a> | <a href="https://nareis.org/privacy">Privacy Policy</a></p>
        </div>
      </body>
    </html>`
};
