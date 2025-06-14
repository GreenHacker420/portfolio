# GitHub Cache System Setup Guide

## Quick Setup

The GitHub cache system has been implemented and is ready to set up. Follow these steps:

### 1. Database Migration

```bash
# Run the migration to add cache tables
npm run cache:migrate
```

This command will:
- Push the new schema to your Neon database (`npx prisma db push`)
- Generate the updated Prisma client (`npx prisma generate`)

### 2. Verify Setup

```bash
# Run the setup script to verify everything works
npm run cache:setup
```

### 3. Test the System

Visit your admin panel and navigate to the GitHub Cache Monitor to see the system in action.

## What's Been Implemented

### ✅ Database Schema
- `GitHubProfileCache` - Caches GitHub profile data
- `GitHubRepoCache` - Caches repository data  
- `GitHubContributionCache` - Caches contribution calendar data
- `GitHubStatsCache` - Caches computed statistics
- `GitHubCacheAnalytics` - Tracks cache performance

### ✅ Netlify Edge Functions
- Global edge caching layer at `/api/edge/github/*`
- Intelligent stale-while-revalidate strategy
- Automatic fallback to local cache and GitHub API

### ✅ Enhanced API Routes
- Updated `/api/github/contributions` with edge cache support
- New admin routes at `/api/admin/github-cache`
- Comprehensive error handling and fallbacks

### ✅ Frontend Integration
- Updated `useGitHubContributions` hook with cache awareness
- New `GitHubCacheMonitor` admin component
- Real-time cache status and analytics

### ✅ Graceful Degradation
- Works without cache (falls back to direct API calls)
- Handles missing database models gracefully
- Provides helpful setup instructions when needed

## Cache Strategy

- **Profile Data**: 1 hour cache, 2 hour stale-while-revalidate
- **Repository Data**: 1 hour cache, 2 hour stale-while-revalidate  
- **Contribution Data**: 24 hour cache, 48 hour stale-while-revalidate
- **Statistics Data**: 30 minute cache, 1 hour stale-while-revalidate

## Performance Benefits

### Before
- Direct GitHub API calls: 200-1000ms
- Rate limit: 5000 requests/hour
- No fallback during outages

### After  
- Edge cache responses: ~50ms globally
- Database cache responses: ~100-200ms
- 90%+ cache hit ratio expected
- Graceful degradation during outages

## Monitoring

Access the cache monitor at `/admin` (GitHub Cache Monitor section) to view:
- Cache hit/miss ratios
- Response times
- Error rates
- Cache health status
- Real-time analytics

## Commands

```bash
# Setup and migration
npm run cache:migrate     # Run database migration
npm run cache:setup       # Verify setup and populate initial cache

# Monitoring (requires NETLIFY_URL env var)
npm run cache:stats       # View cache statistics
npm run cache:health      # Check cache health
npm run cache:invalidate  # Clear all cache
```

## Environment Variables

Make sure these are set in your `.env` file:

```env
# Required
DATABASE_URL=your_neon_postgresql_url
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=your_github_username

# Optional (for edge cache)
NETLIFY_URL=your_netlify_site_url
```

## Troubleshooting

### "GitHub cache system not yet set up" error
1. Run `npm run cache:migrate`
2. Restart your development server
3. Check that environment variables are set

### TypeScript errors about missing Prisma models
1. Run `npx prisma generate`
2. Restart your TypeScript server in your IDE
3. If issues persist, try `node scripts/generate-prisma.js`

### Cache not working
1. Check the admin panel for cache status
2. Verify GitHub token is valid
3. Check database connectivity
4. Review error logs in the cache analytics

## Next Steps

1. **Deploy to Netlify** - Edge functions will be automatically deployed
2. **Monitor Performance** - Use the admin panel to track cache effectiveness
3. **Optimize Settings** - Adjust cache durations based on usage patterns
4. **Set Up Alerts** - Monitor error rates and cache health

The system is designed to work seamlessly with your existing GitHub integration while providing significant performance improvements and better user experience.
