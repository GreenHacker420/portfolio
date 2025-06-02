# Netlify Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- GitHub repository with your portfolio code
- Netlify account (free tier available)
- Domain name (optional, Netlify provides free subdomain)

### 2. Environment Variables Setup
Create these environment variables in Netlify dashboard:

```env
# Required for GitHub API
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=GreenHacker420

# AI Integration (Gemini)
GEMINI_API_KEY=your_gemini_api_key

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_SITE_VERIFICATION=your_google_verification_code
YANDEX_VERIFICATION=your_yandex_verification_code

# Production URL
NETLIFY_URL=https://greenhacker.tech
NODE_ENV=production
```

### 3. Netlify Configuration
The `netlify.toml` file is already configured with:
- ✅ Next.js plugin
- ✅ Security headers
- ✅ PDF embedding support
- ✅ Static asset caching
- ✅ SEO-friendly redirects
- ✅ Performance optimizations

### 4. Domain Setup (Custom Domain)
1. Go to Netlify Dashboard → Site Settings → Domain Management
2. Add custom domain: `greenhacker.tech`
3. Configure DNS records:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: greenhacker.tech
   ```
4. Enable HTTPS (automatic with Netlify)

### 5. Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18.x

## 📊 SEO Verification Checklist

### After Deployment, Verify:

#### 1. Meta Tags
- [ ] Visit https://greenhacker.tech
- [ ] View page source (Ctrl+U)
- [ ] Confirm meta description contains "Full-stack developer portfolio"
- [ ] Verify Open Graph tags for social sharing

#### 2. Structured Data
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Verify Person, WebSite, and Organization schemas
- [ ] Check for validation errors

#### 3. Sitemap & Robots
- [ ] Access https://greenhacker.tech/sitemap.xml
- [ ] Access https://greenhacker.tech/robots.txt
- [ ] Submit sitemap to Google Search Console

#### 4. Performance
- [ ] Test with [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Verify Core Web Vitals scores
- [ ] Check mobile responsiveness

#### 5. Social Media
- [ ] Test with [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Verify LinkedIn preview

## 🔧 Post-Deployment Setup

### Google Search Console
1. Add property: https://greenhacker.tech
2. Verify ownership using meta tag method
3. Submit sitemap: https://greenhacker.tech/sitemap.xml
4. Monitor indexing status

### Google Analytics 4
1. Create GA4 property
2. Add measurement ID to environment variables
3. Verify tracking in Real-time reports
4. Set up conversion goals

### Performance Monitoring
1. Enable Netlify Analytics (optional paid feature)
2. Monitor Core Web Vitals
3. Set up uptime monitoring

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

#### Environment Variables Not Working
- Check variable names match exactly
- Ensure no trailing spaces
- Restart deployment after changes

#### PDF Not Loading
- Verify `resume.pdf` exists in `/public` folder
- Check X-Frame-Options headers in netlify.toml
- Test PDF accessibility directly

#### Analytics Not Tracking
- Verify GA_MEASUREMENT_ID format (starts with G-)
- Check browser console for errors
- Ensure GDPR compliance if needed

### Performance Optimization
```bash
# Analyze bundle size
npm run analyze

# Check for unused dependencies
npm run audit

# Optimize images
# Use Next.js Image component for all images
```

## 📈 SEO Monitoring

### Weekly Tasks
- [ ] Check Google Search Console for crawl errors
- [ ] Monitor Core Web Vitals performance
- [ ] Review analytics for user behavior insights
- [ ] Update content based on search queries

### Monthly Tasks
- [ ] Audit structured data for accuracy
- [ ] Review and update meta descriptions
- [ ] Check for broken links
- [ ] Update sitemap if new content added

### Tools for Monitoring
- Google Search Console
- Google Analytics 4
- PageSpeed Insights
- GTmetrix
- Lighthouse CI

## 🎯 Success Metrics

### SEO Goals
- [ ] Indexed in Google within 48 hours
- [ ] Core Web Vitals all in "Good" range
- [ ] Rich results appearing in search
- [ ] Social media previews working correctly

### Performance Targets
- [ ] Lighthouse Performance Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### Analytics Setup
- [ ] Goal tracking for resume downloads
- [ ] Event tracking for project interactions
- [ ] Conversion funnel for contact form
- [ ] User engagement metrics

## 🔄 Continuous Improvement

### Regular Updates
1. Keep dependencies updated
2. Monitor and fix accessibility issues
3. Optimize images and assets
4. Update content regularly
5. Monitor and improve Core Web Vitals

### A/B Testing Ideas
- Different call-to-action buttons
- Various project presentation formats
- Alternative contact form designs
- Different loading animations

## 📞 Support Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Google Search Console Help](https://support.google.com/webmasters/)
- [Web.dev Performance Guide](https://web.dev/performance/)

---

**🎉 Congratulations!** Your portfolio is now deployed with comprehensive SEO optimization and performance monitoring.
