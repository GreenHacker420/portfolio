# Admin Panel API Reference

All admin endpoints are protected by NextAuth credentials. Include a valid session cookie. Public read endpoints are unauthenticated.

Base URL: /api

## Auth
- POST /api/auth/[...nextauth] — NextAuth routes handled internally

## Public Endpoints

### GET /api/skills
Returns visible skills for the public site.

Query params: none

Response (200):
```json
{
  "skills": [
    {
      "id": "...",
      "name": "TypeScript",
      "description": "",
      "category": "frontend",
      "level": 90,
      "color": "#3178C6",
      "logo": "",
      "experience": 3,
      "projects": ["Project A"],
      "strengths": ["Types", "DX"],
      "displayOrder": 0,
      "isVisible": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

### GET /api/projects
Returns published projects with filter options.

Query params:
- category: string | 'all'
- featured: 'true' | 'false'

Response (200):
```json
{
  "projects": [{ "id": "...", "title": "...", "technologies": ["Next.js"] }],
  "total": 1,
  "categories": ["all", "web"]
}
```

## Admin Endpoints (Auth required)

All admin routes require an authenticated admin session. Middleware guards /admin/** and API ROUTES under /api/admin/** validate getServerSession(authOptions).

### Skills
- GET /api/admin/skills — list with sort
- POST /api/admin/skills — create
- GET /api/admin/skills/[id] — get by id
- PATCH /api/admin/skills/[id] — update
- DELETE /api/admin/skills/[id] — delete
- POST /api/admin/skills/bulk — bulk operations: { action: 'delete' | 'export', ids: string[] }

Create/Update body:
```json
{
  "name": "TypeScript",
  "description": "",
  "category": "frontend",
  "level": 90,
  "color": "#3178C6",
  "logo": "",
  "experience": 3,
  "projects": ["Project A"],
  "strengths": ["Types", "DX"],
  "displayOrder": 0,
  "isVisible": true
}
```

Responses:
- 201 Created: { skill }
- 400 Validation failed: { error, details }
- 401 Unauthorized

Audit: CREATE/UPDATE/DELETE logged to audit_logs with old/new JSON.

### Projects
- GET /api/admin/projects?page=1&limit=10&status=all|draft|published|archived&search=...
- POST /api/admin/projects — create project
- GET /api/admin/projects/[id]
- PATCH /api/admin/projects/[id]
- DELETE /api/admin/projects/[id]
- POST /api/admin/projects/bulk — actions: delete | status | export

Create body (zod-validated):
```json
{
  "title": "My App",
  "description": "...",
  "longDescription": "...",
  "category": "web",
  "technologies": ["Next.js", "Prisma"],
  "status": "draft",
  "featured": false,
  "githubUrl": "",
  "liveUrl": "",
  "imageUrl": "",
  "screenshots": [],
  "startDate": "2024-01-01",
  "endDate": "2024-02-01",
  "highlights": [],
  "displayOrder": 0
}
```

Bulk actions examples:
- Delete: { "action": "delete", "ids": ["id1","id2"] }
- Status: { "action": "status", "ids": ["id1"], "payload": { "status": "published" } }
- Export: { "action": "export", "ids": ["id1","id2"] } → text/csv response

Audit: CREATE/UPDATE/DELETE/BULK_* events logged.

### Contacts
- GET /api/admin/contacts — list submissions
- POST /api/admin/contacts/[id]/reply — create reply with optional AI assistance and optional email send
- PATCH /api/admin/contacts/[id] — update status

### Dashboard
- GET /api/admin/dashboard/stats — aggregate counts
- GET /api/admin/dashboard/activities — recent audit items

### Audit
- GET /api/admin/audit?page=&limit=&action=&resource=&search=

### Settings, Personal, Social, Education, Experience, Media, FAQ
Representative endpoints exist under /api/admin/<resource> with standard CRUD and zod validation. See the code under src/app/api/admin/* for concrete DTOs and validation logic.

## Authentication
- Credentials provider via NextAuth. Login at /admin/login.
- Middleware protects /admin/**; JWT strategy attaches id, role, email, name to session token.

## Errors
- 400: Validation failed (zod)
- 401: Unauthorized (missing/invalid session)
- 404: Not found
- 500: Server error

## Rate Limiting and Security
- AI routes implement simple in-memory rate limiting (replace with Redis in prod)
- Inputs validated and sanitized; dangerous actions protected by auth

## Special Features
- Audit logging: prisma.auditLog records admin actions
- Bulk operations: skills and projects support delete/status/export
- Exports: CSV export for projects via /api/admin/projects/bulk
- AI endpoints: /api/ai/chat, /api/ai/contact-reply

