import nodemailer from 'nodemailer';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Create transporter with configuration
function createTransporter() {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };

  if (!config.auth.user || !config.auth.pass) {
    console.warn('SMTP credentials not configured. Email functionality will be disabled.');
    return null;
  }

  return nodemailer.createTransporter(config);
}

// Auto-reply email template
function getAutoReplyTemplate(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for contacting us</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .highlight { background: #e8f4fd; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Thank You for Reaching Out!</h1>
        <p>Your message has been received</p>
    </div>
    
    <div class="content">
        <p>Hi ${data.name},</p>
        
        <p>Thank you for contacting me through my portfolio website. I've received your message and will get back to you as soon as possible, typically within 24-48 hours.</p>
        
        <div class="highlight">
            <h3>Your Message Summary:</h3>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
        </div>
        
        <p>In the meantime, feel free to:</p>
        <ul>
            <li>Check out my latest projects on <a href="https://github.com/GreenHacker420">GitHub</a></li>
            <li>Connect with me on <a href="https://linkedin.com/in/greenhacker">LinkedIn</a></li>
            <li>Explore more of my work on my <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://greenhacker.tech'}">portfolio</a></li>
        </ul>
        
        <p>Best regards,<br>
        <strong>Green Hacker</strong><br>
        Full Stack Developer</p>
    </div>
    
    <div class="footer">
        <p>This is an automated response. Please do not reply to this email.</p>
        <p>If you need immediate assistance, please contact me directly at harsh@greenhacker.tech</p>
    </div>
</body>
</html>
  `;
}

// Notification email template for site owner
function getNotificationTemplate(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin: 15px 0; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #3b82f6; }
        .field strong { color: #1f2937; }
        .message-box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: pre-wrap; }
        .meta { font-size: 12px; color: #666; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚨 New Contact Form Submission</h1>
        <p>Someone has reached out through your portfolio</p>
    </div>
    
    <div class="content">
        <div class="field">
            <strong>Name:</strong> ${data.name}
        </div>
        
        <div class="field">
            <strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a>
        </div>
        
        <div class="field">
            <strong>Subject:</strong> ${data.subject}
        </div>
        
        <div class="field">
            <strong>Message:</strong>
            <div class="message-box">${data.message}</div>
        </div>
        
        <div class="meta">
            <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
            ${data.ipAddress ? `<p><strong>IP Address:</strong> ${data.ipAddress}</p>` : ''}
            ${data.userAgent ? `<p><strong>User Agent:</strong> ${data.userAgent}</p>` : ''}
        </div>
        
        <p style="margin-top: 30px;">
            <a href="mailto:${data.email}?subject=Re: ${data.subject}" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
               Reply to ${data.name}
            </a>
        </p>
    </div>
</body>
</html>
  `;
}

// Send auto-reply to the contact form submitter
export async function sendAutoReply(data: ContactFormData): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('Email service not configured, skipping auto-reply');
    return false;
  }

  try {
    const mailOptions = {
      from: `"Green Hacker Portfolio" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `Thank you for contacting me, ${data.name}!`,
      html: getAutoReplyTemplate(data),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Auto-reply sent to ${data.email}`);
    return true;
  } catch (error) {
    console.error('Error sending auto-reply:', error);
    return false;
  }
}

// Send notification to site owner
export async function sendNotification(data: ContactFormData): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('Email service not configured, skipping notification');
    return false;
  }

  try {
    const ownerEmail = process.env.OWNER_EMAIL || process.env.SMTP_USER;
    if (!ownerEmail) {
      console.error('Owner email not configured');
      return false;
    }

    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
      to: ownerEmail,
      subject: `New Contact: ${data.subject}`,
      html: getNotificationTemplate(data),
      replyTo: data.email,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${ownerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}

// Send both auto-reply and notification
export async function sendContactEmails(data: ContactFormData): Promise<{ autoReply: boolean; notification: boolean }> {
  const [autoReply, notification] = await Promise.all([
    sendAutoReply(data),
    sendNotification(data)
  ]);

  return { autoReply, notification };
}

// Contact reply data interface
export interface ContactReplyData {
  to: string;
  toName: string;
  subject: string;
  replyMessage: string;
  originalSubject: string;
  originalMessage: string;
  senderName: string;
  senderEmail: string;
}

// Send reply to contact form submission
export async function sendContactReply(data: ContactReplyData): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('Email service not configured, skipping contact reply');
    return false;
  }

  try {
    const replyTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reply from Green Hacker</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .original-message { background: #e8f4fd; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 5px; }
        .reply-message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: pre-wrap; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Reply from ${data.senderName}</h1>
        <p>Response to your inquiry</p>
    </div>

    <div class="content">
        <p>Hi ${data.toName},</p>

        <div class="reply-message">${data.replyMessage}</div>

        <div class="original-message">
            <h4>Your Original Message:</h4>
            <p><strong>Subject:</strong> ${data.originalSubject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${data.originalMessage}</p>
        </div>

        <div class="signature">
            <p>Best regards,<br>
            <strong>${data.senderName}</strong><br>
            Full Stack Developer<br>
            <a href="mailto:${data.senderEmail}">${data.senderEmail}</a></p>

            <p style="margin-top: 20px;">
                <a href="https://greenhacker.tech" style="color: #3b82f6;">Visit my portfolio</a> |
                <a href="https://github.com/GreenHacker420" style="color: #3b82f6;">GitHub</a> |
                <a href="https://linkedin.com/in/greenhacker" style="color: #3b82f6;">LinkedIn</a>
            </p>
        </div>
    </div>

    <div class="footer">
        <p>This email was sent in response to your contact form submission.</p>
    </div>
</body>
</html>
    `;

    const mailOptions = {
      from: `"${data.senderName}" <${data.senderEmail}>`,
      to: `"${data.toName}" <${data.to}>`,
      subject: data.subject,
      html: replyTemplate,
      replyTo: data.senderEmail,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Contact reply sent to ${data.to}`);
    return true;
  } catch (error) {
    console.error('Error sending contact reply:', error);
    return false;
  }
}
