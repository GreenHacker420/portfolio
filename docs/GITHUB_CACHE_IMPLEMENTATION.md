# GitHub Cache Implementation with Netlify Edge Functions

This document describes the comprehensive GitHub caching system implemented using Netlify Edge Functions with Neon PostgreSQL database.

## Overview

The GitHub caching system provides intelligent caching for GitHub API responses to:
- Reduce GitHub API rate limit usage
- Improve response times for users
- Provide fallback data during API outages
- Enable real-time analytics and monitoring

## Architecture

### Components

1. **Netlify Edge Functions** (`netlify/edge-functions/github-cache.ts`)
   - Global edge caching layer
   - Handles cache-first requests
   - Implements stale-while-revalidate strategy

2. **Cache Service** (`src/services/githubCacheService.ts`)
   - Local caching layer for API routes
   - Integrates with edge functions
   - Provides fallback mechanisms

3. **Database Schema** (Prisma models)
   - `GitHubProfileCache` - User profile data
   - `GitHubRepoCache` - Repository data
   - `GitHubContributionCache` - Contribution calendar data
   - `GitHubStatsCache` - Computed statistics
   - `GitHubCacheAnalytics` - Performance monitoring

4. **API Routes**
   - Enhanced existing routes with cache support
   - New admin routes for cache management
   - Monitoring and analytics endpoints

## Cache Strategy

### Cache Durations
- **Profile Data**: 1 hour (stale-while-revalidate: 2 hours)
- **Repository Data**: 1 hour (stale-while-revalidate: 2 hours)
- **Contribution Data**: 24 hours (stale-while-revalidate: 48 hours)
- **Statistics Data**: 30 minutes (stale-while-revalidate: 1 hour)

### Cache Hierarchy
1. **Edge Cache** (Netlify Edge Functions) - Global, fastest
2. **Database Cache** (Neon PostgreSQL) - Persistent, reliable
3. **GitHub API** - Fresh data, rate-limited

### Stale-While-Revalidate
- Serves stale data immediately
- Triggers background refresh
- Ensures users always get fast responses

## Setup Instructions

### 1. Database Migration

```bash
# Generate Prisma client with new schema
npx prisma generate

# Push schema changes to database
npx prisma db push

# Or create a migration
npx prisma migrate dev --name add-github-cache
```

**Note**: If you encounter TypeScript errors about missing Prisma models, run:
```bash
# Alternative generation script
node scripts/generate-prisma.js
```

### 2. Environment Variables

Add to your `.env` file:
```env
# Required
DATABASE_URL=your_neon_postgresql_url
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=your_github_username

# Optional
NETLIFY_URL=your_netlify_site_url
```

### 3. Run Setup Script

```bash
# Run the setup script to initialize the cache system
npx tsx scripts/setup-github-cache.ts
```

### 4. Deploy to Netlify

The edge functions will be automatically deployed with your site.

## Usage

### Frontend Integration

The existing `useGitHubContributions` hook automatically uses the new caching system:

```typescript
const { 
  contributions, 
  isLoading, 
  error, 
  source,        // 'cache' | 'api' | 'edge' | 'stale-cache'
  cacheStatus,   // 'hit' | 'miss' | 'stale' | 'edge-hit'
  age,           // Cache age in seconds
  refresh 
} = useGitHubContributions(2024);
```

### API Endpoints

#### Enhanced GitHub API Routes
```bash
# Contributions with edge cache support
GET /api/github/contributions?year=2024&edge=true

# Profile data (automatically cached)
GET /api/github/profile

# Repository data (automatically cached)
GET /api/github/repos?page=1&per_page=30
```

#### Edge Function Endpoints
```bash
# Direct edge cache access
GET /api/edge/github/profile
GET /api/edge/github/repos?page=1&per_page=30
GET /api/edge/github/contributions?year=2024

# Cache invalidation
POST /api/edge/github/invalidate
```

#### Cache Management (Admin)
```bash
# Get cache statistics
GET /api/admin/github-cache?action=stats

# Get cache health status
GET /api/admin/github-cache?action=health

# Invalidate all cache
POST /api/admin/github-cache
Content-Type: application/json
{
  "action": "invalidate"
}

# Refresh specific cache
POST /api/admin/github-cache
Content-Type: application/json
{
  "action": "refresh",
  "type": "profile"
}

# Clean up old analytics
POST /api/admin/github-cache
Content-Type: application/json
{
  "action": "cleanup"
}
```

## Monitoring

### Cache Analytics

The system automatically tracks:
- Cache hit/miss ratios
- Response times
- Error rates
- Data sizes
- Edge function performance

### Health Monitoring

Access cache health at `/api/admin/github-cache?action=health`:

```json
{
  "success": true,
  "health": {
    "profile": {
      "status": "healthy",
      "expired": false,
      "stale": false,
      "errorCount": 0,
      "lastFetch": "2024-01-15T10:30:00Z"
    },
    "contributions": [
      {
        "year": 2024,
        "status": "healthy",
        "expired": false,
        "stale": false,
        "errorCount": 0,
        "lastFetch": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

## Performance Benefits

### Before Implementation
- Direct GitHub API calls for every request
- Rate limit constraints (5000 requests/hour)
- Variable response times (200-1000ms)
- No fallback during API outages

### After Implementation
- Edge cache responses: ~50ms globally
- Database cache responses: ~100-200ms
- 90%+ cache hit ratio expected
- Graceful degradation during outages
- Intelligent background refresh

## Error Handling

### Fallback Strategy
1. Try edge cache first
2. Fall back to database cache
3. Serve stale data if available
4. Fall back to GitHub API
5. Return cached error state if all fail

### Rate Limit Management
- Respects GitHub API rate limits
- Implements exponential backoff
- Tracks rate limit headers
- Provides rate limit info in responses

## Troubleshooting

### Common Issues

1. **TypeScript errors about missing Prisma models**
   - Run `npx prisma generate` to regenerate the client
   - If that fails, try `node scripts/generate-prisma.js`
   - Restart your TypeScript server in your IDE

2. **"GitHub cache system not yet set up" error**
   - Run database migration: `npx prisma db push`
   - Generate Prisma client: `npx prisma generate`
   - Run setup script: `npm run cache:setup`

3. **Edge functions not working**
   - Check Netlify deployment logs
   - Verify environment variables are set
   - Ensure DATABASE_URL is accessible from edge

4. **Cache not updating**
   - Check cache expiration times
   - Verify background refresh is working
   - Use force refresh parameter

5. **High error rates**
   - Check GitHub token validity
   - Verify database connectivity
   - Review error logs in analytics

6. **Admin panel shows "missing" status**
   - This is normal before first cache population
   - Use the refresh buttons to populate cache
   - Check that GitHub API credentials are configured

### Debug Commands

```bash
# Check cache status
curl "https://your-site.netlify.app/api/admin/github-cache?action=health"

# Force cache refresh
curl -X POST "https://your-site.netlify.app/api/admin/github-cache" \
  -H "Content-Type: application/json" \
  -d '{"action": "refresh"}'

# View cache analytics
curl "https://your-site.netlify.app/api/admin/github-cache?action=stats"
```

## Future Enhancements

### Planned Features
- Cache warming strategies
- Predictive cache refresh
- Multi-user cache support
- Cache compression
- Advanced analytics dashboard

### Optimization Opportunities
- Implement cache compression
- Add cache warming for popular data
- Optimize database queries
- Add cache partitioning by region

## Security Considerations

- GitHub tokens are never exposed to client
- Cache data is stored securely in Neon
- Rate limiting prevents abuse
- Analytics data is anonymized
- Admin endpoints should be protected

## Maintenance

### Regular Tasks
- Monitor cache hit ratios
- Clean up old analytics data
- Review error patterns
- Update cache durations based on usage
- Monitor database storage usage

### Automated Cleanup
The system includes automatic cleanup of:
- Analytics data older than 30 days
- Expired cache entries
- Error state tracking

This implementation provides a robust, scalable caching solution that significantly improves the performance and reliability of GitHub data integration in your portfolio website.
