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

export interface SignatureConfig {
  name: string;
  alias: string;
  title: string;
  email: string;
  website: string;
  phone?: string;
  tagline?: string;
  imageUrl?: string; // Optional custom image URL
  socialLinks: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
}

// Default signature configuration for Harsh Hirawat aka GreenHacker
const defaultSignatureConfig: SignatureConfig = {
  name: 'Harsh Hirawat',
  alias: 'GreenHacker',
  title: 'Full Stack Developer',
  email: process.env.OWNER_EMAIL || 'harsh@greenhacker.tech',
  website: process.env.NEXT_PUBLIC_SITE_URL || 'https://greenhacker.tech',
  phone: process.env.CONTACT_PHONE,
  tagline: 'Building innovative digital solutions with cutting-edge technology',
  imageUrl: undefined, // Will use default /image.png from public folder
  socialLinks: {
    github: 'https://github.com/GreenHacker420',
    linkedin: 'https://www.linkedin.com/in/harsh-hirawat-b657061b7/',
    instagram: 'https://www.instagram.com/harsh_hirawat/',
    twitter: 'https://twitter.com/greenhacker420'
  }
};

// Generate HTML signature
function generateHtmlSignature(config: SignatureConfig = defaultSignatureConfig): string {
  const socialLinksHtml = Object.entries(config.socialLinks)
    .filter(([_, url]) => url)
    .map(([platform, url]) => {
      const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
      return `<a href="${url}" style="color: #3b82f6; text-decoration: none; margin-right: 15px;">${platformName}</a>`;
    })
    .join('');

  // Get the image URL - use custom imageUrl if provided, otherwise use default image.png
  const baseUrl = config.website || process.env.NEXT_PUBLIC_SITE_URL || 'https://greenhacker.tech';
  const imageUrl = config.imageUrl || `${baseUrl}/image.png`;

  return `
    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; font-family: Arial, sans-serif;">
      <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 500px;">
        <tr>
          <td style="vertical-align: top; padding-right: 20px;">
            <!-- Profile Image with Fallback Background -->
            <div style="width: 80px; height: 80px; margin-bottom: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; border: 3px solid #e5e7eb; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
              <!-- Background fallback text (shows if image doesn't load) -->
              <div style="color: white; font-size: 28px; font-weight: bold; position: absolute; z-index: 1;">
                ${config.alias.charAt(0)}
              </div>
              <!-- Profile image (overlays the background) -->
              <img src="${imageUrl}"
                   alt="${config.name} - ${config.alias}"
                   style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; position: absolute; top: 0; left: 0; z-index: 2;" />
            </div>
          </td>
          <td style="vertical-align: top;">
            <div style="color: #1f2937;">
              <h3 style="margin: 0 0 5px 0; font-size: 18px; font-weight: bold; color: #111827;">
                ${config.name} aka ${config.alias}
              </h3>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; font-weight: 500;">
                ${config.title}
              </p>
              ${config.tagline ? `<p style="margin: 0 0 15px 0; font-size: 13px; color: #9ca3af; font-style: italic;">${config.tagline}</p>` : ''}

              <div style="margin-bottom: 10px;">
                <p style="margin: 0 0 5px 0; font-size: 13px; color: #374151;">
                  📧 <a href="mailto:${config.email}" style="color: #3b82f6; text-decoration: none;">${config.email}</a>
                </p>
                <p style="margin: 0 0 5px 0; font-size: 13px; color: #374151;">
                  🌐 <a href="${config.website}" style="color: #3b82f6; text-decoration: none;">${config.website}</a>
                </p>
                ${config.phone ? `<p style="margin: 0 0 5px 0; font-size: 13px; color: #374151;">📞 ${config.phone}</p>` : ''}
              </div>

              ${socialLinksHtml ? `
                <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280; font-weight: 500;">Connect with me:</p>
                  <div style="font-size: 13px;">
                    ${socialLinksHtml}
                  </div>
                </div>
              ` : ''}
            </div>
          </td>
        </tr>
      </table>

      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #f3f4f6; text-align: center;">
        <p style="margin: 0; font-size: 11px; color: #9ca3af;">
          This email was sent from ${config.name}'s portfolio contact system
        </p>
      </div>
    </div>
  `;
}

// Generate plain text signature
function generatePlainTextSignature(config: SignatureConfig = defaultSignatureConfig): string {
  const socialLinks = Object.entries(config.socialLinks)
    .filter(([_, url]) => url)
    .map(([platform, url]) => `${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${url}`)
    .join('\n');

  return `
---
${config.name} aka ${config.alias}
${config.title}
${config.tagline ? config.tagline + '\n' : ''}
Email: ${config.email}
Website: ${config.website}
${config.phone ? `Phone: ${config.phone}\n` : ''}
${socialLinks ? `\nConnect with me:\n${socialLinks}\n` : ''}
---
This email was sent from ${config.name}'s portfolio contact system
  `.trim();
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

  return nodemailer.createTransport(config);
}

// Auto-reply email template
function getAutoReplyTemplate(data: ContactFormData): string {
  const signature = generateHtmlSignature();

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
            <li>Connect with me on <a href="https://www.linkedin.com/in/harsh-hirawat-b657061b7/">LinkedIn</a></li>
            <li>Explore more of my work on my <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://greenhacker.tech'}">portfolio</a></li>
        </ul>

        ${signature}
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
  const signature = generateHtmlSignature();

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

        ${signature}
    </div>
</body>
</html>
  `;
}

// Generate plain text version of auto-reply
function getAutoReplyPlainText(data: ContactFormData): string {
  const signature = generatePlainTextSignature();

  return `Hi ${data.name},

Thank you for contacting me through my portfolio website. I've received your message and will get back to you as soon as possible, typically within 24-48 hours.

Your Message Summary:
Subject: ${data.subject}
Submitted: ${new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}

In the meantime, feel free to:
- Check out my latest projects on GitHub: https://github.com/GreenHacker420
- Connect with me on LinkedIn: https://www.linkedin.com/in/harsh-hirawat-b657061b7/
- Explore more of my work on my portfolio: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://greenhacker.tech'}

${signature}

---
This is an automated response. Please do not reply to this email.
If you need immediate assistance, please contact me directly at harsh@greenhacker.tech`;
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
      from: `"Harsh Hirawat aka GreenHacker" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `Thank you for contacting me, ${data.name}!`,
      html: getAutoReplyTemplate(data),
      text: getAutoReplyPlainText(data),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Auto-reply sent to ${data.email}`);
    return true;
  } catch (error) {
    console.error('Error sending auto-reply:', error);
    return false;
  }
}

// Generate plain text version of notification
function getNotificationPlainText(data: ContactFormData): string {
  const signature = generatePlainTextSignature();

  return `🚨 NEW CONTACT FORM SUBMISSION
Someone has reached out through your portfolio

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

Submitted: ${new Date().toISOString()}
${data.ipAddress ? `IP Address: ${data.ipAddress}` : ''}
${data.userAgent ? `User Agent: ${data.userAgent}` : ''}

Reply to ${data.name}: mailto:${data.email}?subject=Re: ${data.subject}

${signature}`;
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
      text: getNotificationPlainText(data),
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
    const signature = generateHtmlSignature();

    const replyTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reply from ${data.senderName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .original-message { background: #e8f4fd; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 5px; }
        .reply-message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: pre-wrap; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
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

        ${signature}
    </div>

    <div class="footer">
        <p>This email was sent in response to your contact form submission.</p>
    </div>
</body>
</html>
    `;

    // Generate plain text version
    const plainTextSignature = generatePlainTextSignature();
    const plainTextReply = `Hi ${data.toName},

${data.replyMessage}

Your Original Message:
Subject: ${data.originalSubject}
Message:
${data.originalMessage}

${plainTextSignature}

---
This email was sent in response to your contact form submission.`;

    const mailOptions = {
      from: `"${data.senderName}" <${data.senderEmail}>`,
      to: `"${data.toName}" <${data.to}>`,
      subject: data.subject,
      html: replyTemplate,
      text: plainTextReply,
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

// Export signature functions for potential use in other parts of the application
export { generateHtmlSignature, generatePlainTextSignature, defaultSignatureConfig };

// Utility function to create custom signature configuration
export function createSignatureConfig(overrides: Partial<SignatureConfig>): SignatureConfig {
  return {
    ...defaultSignatureConfig,
    ...overrides,
    socialLinks: {
      ...defaultSignatureConfig.socialLinks,
      ...overrides.socialLinks
    }
  };
}

// Function to validate signature configuration
export function validateSignatureConfig(config: SignatureConfig): boolean {
  const required = ['name', 'alias', 'title', 'email', 'website'];
  return required.every(field => config[field as keyof SignatureConfig]);
}

// Function to get signature preview (for admin panel or testing)
export function getSignaturePreview(config: SignatureConfig = defaultSignatureConfig): {
  html: string;
  text: string;
} {
  return {
    html: generateHtmlSignature(config),
    text: generatePlainTextSignature(config)
  };
}
