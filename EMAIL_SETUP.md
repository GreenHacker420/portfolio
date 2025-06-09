# AI & Email Service Configuration

This document explains how to configure the AI-powered features and email service for the portfolio system.

## Environment Variables

Add the following environment variables to your `.env.local` file:

### Google Gemini AI Configuration

```env
# Google Gemini API Key (required for AI features)
GEMINI_API_KEY=your-gemini-api-key-here
```

### Email Service Configuration

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Owner Email (where notifications are sent)
OWNER_EMAIL=your-email@gmail.com

# Site URL (used in email templates)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

3. **Configuration Example**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
OWNER_EMAIL=your-email@gmail.com
```

## Other SMTP Providers

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Custom SMTP
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
```

## Email Features

When properly configured, the system will:

1. **Auto-Reply**: Send a confirmation email to the contact form submitter
2. **Notification**: Send a notification email to you (the site owner)
3. **Professional Templates**: Use HTML templates with your branding
4. **Error Handling**: Gracefully handle email delivery failures

## Testing Email Configuration

1. Set up your environment variables
2. Restart your development server
3. Submit a test contact form
4. Check the server logs for email delivery status
5. Verify emails are received in both inboxes

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Verify your username and password
   - For Gmail, ensure you're using an App Password, not your regular password
   - Check if 2FA is enabled (required for Gmail App Passwords)

2. **"Connection timeout"**
   - Verify the SMTP host and port
   - Check if your hosting provider blocks SMTP ports
   - Try using port 465 with `SMTP_SECURE=true`

3. **"Email not received"**
   - Check spam/junk folders
   - Verify the recipient email address
   - Check server logs for delivery errors

### Debug Mode

To enable detailed email debugging, check the server console logs when submitting contact forms. The system will log:
- SMTP connection status
- Email sending attempts
- Success/failure messages
- Error details

## Security Notes

- Never commit SMTP credentials to version control
- Use environment variables for all sensitive configuration
- Consider using dedicated email services for production
- Regularly rotate your SMTP passwords
- Monitor email delivery rates and bounce rates

## Production Recommendations

For production environments, consider:
- **Dedicated Email Service**: SendGrid, Mailgun, or AWS SES
- **Email Analytics**: Track delivery rates, opens, and clicks
- **Rate Limiting**: Implement additional rate limiting for contact forms
- **Spam Protection**: Add CAPTCHA or similar protection
- **Email Templates**: Customize templates with your branding

## Google Gemini AI Setup

### Getting Your API Key

1. **Visit Google AI Studio**:
   - Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account

2. **Create API Key**:
   - Click "Create API Key"
   - Choose "Create API key in new project" or select existing project
   - Copy the generated API key

3. **Add to Environment Variables**:
```env
GEMINI_API_KEY=your-actual-api-key-here
```

### AI Features

When properly configured, the system provides:

1. **GitHub Stats AI Overview**:
   - Intelligent analysis of GitHub profile and repositories
   - Insights into coding patterns and skill development
   - Professional summary for portfolio visitors
   - Updates every 24 hours with caching

2. **AI-Powered Contact Replies**:
   - Auto-generate professional responses to contact form submissions
   - Enhance draft replies for better tone and clarity
   - Context-aware responses based on portfolio owner's background
   - Audit logging for all AI-generated content

### Rate Limiting

The AI service includes built-in rate limiting:
- **10 requests per minute** per IP address
- **24-hour caching** for GitHub analysis
- **Graceful fallback** when limits are exceeded

### Testing AI Configuration

1. Set up your `GEMINI_API_KEY` environment variable
2. Restart your development server
3. Visit the portfolio website to see GitHub AI analysis
4. Test contact reply generation in the admin panel
5. Check server logs for AI service status

### Troubleshooting AI Features

#### Common Issues

1. **"Gemini API key not configured"**
   - Verify `GEMINI_API_KEY` is set in your environment variables
   - Ensure the API key is valid and active
   - Check Google AI Studio for API key status

2. **"Rate limit exceeded"**
   - Wait for the rate limit window to reset (1 minute)
   - Consider implementing Redis-based rate limiting for production
   - Check if multiple users are accessing the AI features simultaneously

3. **"Failed to generate AI content"**
   - Check your internet connection
   - Verify the Gemini API service status
   - Review server logs for detailed error messages
   - Ensure your API key has sufficient quota

#### Debug Mode

To enable detailed AI debugging:
1. Check the browser console for client-side errors
2. Monitor server logs for API call details
3. Use the admin panel to test AI features directly
4. Verify GitHub data is being fetched correctly

### Production Recommendations

For production environments:
- **Monitor API Usage**: Track Gemini API calls and costs
- **Implement Caching**: Use Redis for better rate limiting and caching
- **Error Handling**: Implement comprehensive fallback strategies
- **Security**: Rotate API keys regularly
- **Performance**: Monitor AI response times and optimize prompts
