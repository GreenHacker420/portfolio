# Deployment Guide for Next.js Portfolio

## Overview
This guide covers deploying your Next.js portfolio to Vercel with all the enhanced features including GitHub API integration, 3D components, and AI capabilities.

## Prerequisites
- Vercel account
- GitHub account and repository
- GitHub Personal Access Token (for real GitHub data)
- Gemini API key (for AI features)

## Environment Variables Setup

### Required Environment Variables
Create these environment variables in your Vercel dashboard:

```bash
# GitHub API Configuration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=your_github_username

# Gemini AI Configuration (optional)
GEMINI_API_KEY=your_gemini_api_key

# Next.js Configuration
NEXTAUTH_SECRET=your_secure_random_string
NEXTAUTH_URL=https://your-domain.vercel.app

# Email Configuration (optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

### Getting a GitHub Personal Access Token
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token (classic)
3. Select scopes: `public_repo`, `read:user`, `read:org`
4. Copy the token and add it to your environment variables

## Deployment Steps

### 1. Prepare Your Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add GITHUB_TOKEN
vercel env add GITHUB_USERNAME
# ... add other variables

# Redeploy with environment variables
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables in the dashboard
4. Deploy

### 3. Post-Deployment Configuration

#### Update Environment Variables
- Set `NEXTAUTH_URL` to your production domain
- Verify all API endpoints are working
- Test GitHub API integration

#### Performance Optimization
The project includes several optimizations:
- Image optimization with WebP/AVIF formats
- CSS optimization
- Package import optimization
- Proper caching headers

## Features Included

### ✅ Fixed Issues
- **CSS Import Error**: Fixed Google Fonts import order
- **Three.js SSR Issues**: Implemented proper dynamic imports
- **3D Keyboard Component**: Working Spline integration

### ✅ GitHub API Integration
- Real-time GitHub stats
- Repository data with filtering
- Contribution graph visualization
- Rate limiting and error handling
- Fallback to mock data when API is unavailable

### ✅ Enhanced API Routes
- `/api/github/stats` - User stats and activity
- `/api/github/repos` - Repository data
- `/api/github/contributions` - Contribution graph data
- `/api/projects` - Project portfolio data
- `/api/contact` - Contact form with validation and rate limiting

### ✅ Production Optimizations
- Security headers
- Image optimization
- CSS optimization
- Performance monitoring
- Error boundaries

## Testing

### Local Testing
```bash
# Test development build
npm run dev

# Test production build
npm run build
npm run start

# Test API endpoints
curl http://localhost:3000/api/github/stats
curl http://localhost:3000/api/projects
```

### Production Testing
After deployment, test:
- All pages load correctly
- 3D components render properly
- API endpoints return data
- Contact form works
- GitHub integration displays real data

## Monitoring and Maintenance

### Performance Monitoring
- Use Vercel Analytics
- Monitor Core Web Vitals
- Check API response times

### Regular Updates
- Keep dependencies updated
- Monitor GitHub API rate limits
- Update environment variables as needed

## Troubleshooting

### Common Issues
1. **3D Components Not Loading**: Check browser WebGL support
2. **GitHub API Rate Limits**: Implement proper caching
3. **Build Failures**: Check TypeScript errors and dependencies
4. **Environment Variables**: Ensure all required variables are set

### Debug Commands
```bash
# Check build locally
npm run build

# Type checking
npm run type-check

# Lint checking
npm run lint
```

## Security Considerations
- Never commit API keys to repository
- Use environment variables for all sensitive data
- Implement rate limiting on API routes
- Validate and sanitize all user inputs
- Use HTTPS in production

## Support
For issues or questions:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Test API endpoints individually
4. Check Vercel deployment logs
