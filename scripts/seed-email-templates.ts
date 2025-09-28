import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultTemplates = [
  {
    name: 'contact-auto-reply',
    subject: 'Thank you for reaching out! - {{ownerName}}',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for your message</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                Thank You, {{name}}!
            </h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                Your message has been received
            </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi {{name}},
            </p>
            
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for reaching out! I've received your message about "<strong>{{subject}}</strong>" and I appreciate you taking the time to contact me.
            </p>
            
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                I'll review your message and get back to you within 24-48 hours. If your inquiry is urgent, please feel free to reach out to me directly.
            </p>
            
            <!-- Message Summary -->
            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0;">
                <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 18px;">Your Message:</h3>
                <p style="color: #666666; margin: 0; font-style: italic; line-height: 1.5;">
                    "{{message}}"
                </p>
            </div>
            
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                In the meantime, feel free to explore my portfolio and recent projects on my website.
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{website}}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: 600; font-size: 16px;">
                    Visit My Portfolio
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #666666; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                {{ownerName}} ({{ownerAlias}})
            </p>
            <p style="color: #666666; margin: 0 0 10px 0; font-size: 14px;">
                {{ownerTitle}}
            </p>
            <p style="color: #666666; margin: 0 0 15px 0; font-size: 14px;">
                <a href="{{website}}" style="color: #667eea; text-decoration: none;">{{website}}</a>
            </p>
            <p style="color: #999999; margin: 0; font-size: 12px;">
                This is an automated response. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>`,
    textContent: `Hi {{name}},

Thank you for reaching out! I've received your message about "{{subject}}" and I appreciate you taking the time to contact me.

Your Message:
"{{message}}"

I'll review your message and get back to you within 24-48 hours. If your inquiry is urgent, please feel free to reach out to me directly.

In the meantime, feel free to explore my portfolio and recent projects at {{website}}.

Best regards,
{{ownerName}} ({{ownerAlias}})
{{ownerTitle}}
{{website}}

---
This is an automated response. Please do not reply to this email.`,
    variables: ['name', 'email', 'subject', 'message', 'date', 'ownerName', 'ownerAlias', 'ownerTitle', 'website'],
    isActive: true,
    description: 'Automatic reply sent to users when they submit the contact form',
    category: 'contact'
  },
  {
    name: 'contact-notification',
    subject: 'New Contact Form Submission - {{subject}}',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
            <h1 style="color: #00ff41; margin: 0; font-size: 24px; font-family: 'Courier New', monospace;">
                > NEW_CONTACT_RECEIVED
            </h1>
            <p style="color: #00ff41; margin: 10px 0 0 0; font-size: 14px; font-family: 'Courier New', monospace;">
                {{date}}
            </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 5px; padding: 20px; margin-bottom: 20px;">
                <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Contact Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #666666; font-weight: 600; width: 100px;">Name:</td>
                        <td style="padding: 8px 0; color: #333333;">{{name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666666; font-weight: 600;">Email:</td>
                        <td style="padding: 8px 0; color: #333333;">
                            <a href="mailto:{{email}}" style="color: #667eea; text-decoration: none;">{{email}}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666666; font-weight: 600;">Subject:</td>
                        <td style="padding: 8px 0; color: #333333;">{{subject}}</td>
                    </tr>
                </table>
            </div>
            
            <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 5px; padding: 20px;">
                <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 16px;">Message:</h3>
                <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 3px; padding: 15px; white-space: pre-wrap; line-height: 1.5; color: #333333;">{{message}}</div>
            </div>
            
            <!-- Quick Actions -->
            <div style="margin-top: 30px; text-align: center;">
                <a href="mailto:{{email}}?subject=Re: {{subject}}" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: 600; margin: 0 10px;">
                    Reply via Email
                </a>
                <a href="{{website}}/admin/contacts" style="display: inline-block; background-color: #28a745; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: 600; margin: 0 10px;">
                    View in Admin
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
            <p style="color: #00ff41; margin: 0; font-size: 12px; font-family: 'Courier New', monospace;">
                > PORTFOLIO_CONTACT_SYSTEM_v2.0
            </p>
        </div>
    </div>
</body>
</html>`,
    textContent: `NEW CONTACT FORM SUBMISSION
{{date}}

Contact Details:
- Name: {{name}}
- Email: {{email}}
- Subject: {{subject}}

Message:
{{message}}

---
Reply to: {{email}}
Admin Panel: {{website}}/admin/contacts`,
    variables: ['name', 'email', 'subject', 'message', 'date', 'website'],
    isActive: true,
    description: 'Notification email sent to admin when someone submits the contact form',
    category: 'contact'
  }
]

async function seedEmailTemplates() {
  console.log('🌱 Seeding email templates...')

  for (const template of defaultTemplates) {
    try {
      const existing = await prisma.emailTemplate.findUnique({
        where: { name: template.name }
      })

      if (existing) {
        console.log(`📧 Updating existing template: ${template.name}`)
        await prisma.emailTemplate.update({
          where: { name: template.name },
          data: {
            ...template,
            variables: JSON.stringify(template.variables)
          }
        })
      } else {
        console.log(`📧 Creating new template: ${template.name}`)
        await prisma.emailTemplate.create({
          data: {
            ...template,
            variables: JSON.stringify(template.variables)
          }
        })
      }
    } catch (error) {
      console.error(`❌ Error seeding template ${template.name}:`, error)
    }
  }

  console.log('✅ Email templates seeded successfully!')
}

if (require.main === module) {
  seedEmailTemplates()
    .catch((e) => {
      console.error('❌ Error seeding email templates:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export { seedEmailTemplates }
