# Database Schema

Prisma models stored in prisma/schema.prisma. Key tables are summarized below.

## AdminUser
- id (cuid)
- email (unique)
- password (hash)
- name
- role (default: admin)
- createdAt, updatedAt

## Skill
- id (cuid)
- name, description?
- category
- level (1-100)
- color, logo?
- experience? (years)
- projects? (JSON string)
- strengths? (JSON string)
- displayOrder (int)
- isVisible (bool)
- createdAt, updatedAt

## Project
- id (cuid)
- title, description, longDescription?
- category
- technologies (JSON string)
- status (draft|published|archived)
- featured (bool)
- githubUrl?, liveUrl?, imageUrl?
- screenshots? (JSON)
- startDate?, endDate?
- highlights? (JSON)
- displayOrder (int)
- createdAt, updatedAt

## Contact & ContactReply
- Contact: id, name, email, subject, message, status, ipAddress?, userAgent?, createdAt, updatedAt
- ContactReply: id, contactId, userId, subject, message, isAiGenerated, aiMode?, emailSent, createdAt, updatedAt

## Education, WorkExperience
- Standard content with dates, isVisible, displayOrder, createdAt, updatedAt

## Media
- id, filename, originalName, mimeType, size, url, alt?, category, isVisible, uploadedBy?, createdAt, updatedAt

## Faq
- id, question, answer, category, tags?, isVisible, displayOrder, viewCount, helpful, notHelpful, createdAt, updatedAt

## Setting
- id, key (unique), value (JSON), createdAt, updatedAt

## ChatInteraction
- id, sessionId, userMessage, botResponse, context?, isHelpful?, ipAddress?, userAgent?, responseTime?, createdAt

## AuditLog
- id, userId, action, resource, resourceId?, oldData?, newData?, ipAddress?, userAgent?, createdAt

## GitHub Cache Tables
- GitHubProfileCache, GitHubRepoCache, GitHubContributionCache, GitHubStatsCache, GitHubCacheAnalytics

See prisma/schema.prisma for exact field types and mappings. Run prisma studio to explore:

```bash
npm run db:studio
```

