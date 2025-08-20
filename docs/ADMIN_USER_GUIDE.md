# Admin Panel User Guide

This guide shows how to use the admin panel to manage your portfolio content.

## Accessing the Admin Panel
1. Navigate to /admin
2. If redirected to /admin/login, sign in with your admin credentials
3. After login, you’ll land on the Dashboard

## Dashboard
- Overview stats (skills, projects counts, recent activity)
- Recent actions from the audit log

## Global UI
- Top navigation: switch between sections
- Notifications: toasts appear for success/errors
- Dark/light theme: toggle via the theme menu

## Managing Skills
1. Go to Admin → Skills
2. Create: Click “New Skill”, fill out the form (name, category, level, etc.)
3. Edit: Click a skill row → edit fields
4. Bulk actions: Select multiple → delete or export
5. Visibility: Toggle isVisible to hide/show on the public site

## Managing Projects
1. Go to Admin → Projects
2. Create: “New Project”, fill title, category, status, technologies, etc.
3. Search/Filter: Use status filter and search box
4. Bulk actions:
   - Delete selected
   - Set status (draft/published/archived)
   - Export CSV for selected
5. Screenshots/Highlights: Add arrays of strings; URLs for images and links

## Contacts Inbox
- View submissions from the public contact form
- Reply to a contact:
  - Optional: Use AI to draft or enhance a reply
  - Optionally send email (configure SMTP first)
  - Reply creates an audit log entry
- Update status (pending/responded/archived)

## Education & Experience
- Standard CRUD entries with dates and descriptions
- Order items using displayOrder for preferred listing

## Personal Info & Social Links
- Update profile data displayed on the portfolio (name, title, bio, links)
- Control visibility and ordering of social links

## Media
- Upload and manage files (images, documents)
- Store URLs and alt text; categorize assets for reuse

## Settings
- Key-value JSON config for site features
- Keep changes minimal and documented

## Audit Logs
- See who did what and when
- Filter by action (CREATE/UPDATE/DELETE/BULK_*/AI_*) and resource
- Useful for debugging and compliance

## Tips
- Save frequently; watch for toast notifications
- Use search and filters for faster navigation
- Leverage bulk actions for large edits

## Troubleshooting
- Can’t access admin: ensure NEXTAUTH_URL/NEXTAUTH_SECRET set; check admin role
- Missing admin user: POST /api/admin/bootstrap or seed with npm run db:seed
- Emails not sending: configure SMTP_* and OWNER_EMAIL
- AI reply disabled: set GEMINI_API_KEY
- Database schema mismatch: run npm run db:push

## Screenshots
- Dashboard overview
- Skills table with bulk selection
- Projects list with filters and bulk actions
- Contacts reply modal (with AI options)

Add your own screenshots in docs/images and link them here.

