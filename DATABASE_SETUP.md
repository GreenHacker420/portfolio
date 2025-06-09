# 🗄️ Database Setup Guide for Portfolio Admin

## Current Status
Your Prisma schema is configured with SQLite for development. Here are your options for different environments:

## 🟢 RECOMMENDED: PostgreSQL (Production)

### Why PostgreSQL?
- ✅ **Production Ready**: Robust, reliable, and scalable
- ✅ **Advanced Features**: JSON support, full-text search, advanced indexing
- ✅ **Deployment Friendly**: Supported by all major hosting platforms
- ✅ **Data Integrity**: ACID compliance, foreign key constraints
- ✅ **Performance**: Better for concurrent users and complex queries

### Setup Options:

#### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb portfolio_admin

# Update .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_admin"
```

#### Option 2: Cloud PostgreSQL (Recommended)
**Supabase (Free tier available):**
```bash
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Copy connection string to .env.local
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
```

**Neon (Free tier available):**
```bash
# 1. Go to https://neon.tech
# 2. Create new project
# 3. Copy connection string
DATABASE_URL="postgresql://[user]:[password]@[host]/[dbname]"
```

**Railway (Simple deployment):**
```bash
# 1. Go to https://railway.app
# 2. Create PostgreSQL service
# 3. Copy DATABASE_URL
```

### Update Prisma Schema:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 🟡 ALTERNATIVE: SQLite (Development/Small Scale)

### Current Setup (Already configured)
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Pros:
- ✅ **Zero Setup**: Works out of the box
- ✅ **Lightweight**: Single file database
- ✅ **Fast Development**: No external dependencies

### Cons:
- ❌ **Single User**: No concurrent write access
- ❌ **Limited Features**: No advanced SQL features
- ❌ **Deployment Issues**: File-based, harder to backup/restore

## 🔵 ALTERNATIVE: MySQL/MariaDB

### Setup:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Connection String:
```bash
DATABASE_URL="mysql://username:password@localhost:3306/portfolio_admin"
```

## 🟠 CLOUD OPTIONS COMPARISON

| Provider | Free Tier | Pros | Best For |
|----------|-----------|------|----------|
| **Supabase** | 500MB, 2 projects | Full PostgreSQL, Auth, Storage | Full-stack apps |
| **Neon** | 3GB, Serverless | Auto-scaling, branching | Modern apps |
| **Railway** | $5/month | Simple deployment | Quick setup |
| **PlanetScale** | 1 DB, 1GB | MySQL, branching | MySQL preference |

## 🚀 RECOMMENDED SETUP STEPS

### 1. Choose Your Database
**For Production/Deployment:** PostgreSQL (Supabase or Neon)
**For Local Development:** Keep SQLite

### 2. Environment Configuration
Create `.env.local`:
```bash
# Database
DATABASE_URL="your_database_connection_string"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Admin Credentials (for seeding)
ADMIN_EMAIL="admin@greenhacker.tech"
ADMIN_PASSWORD="your-secure-password"
```

### 3. Database Migration
```bash
# Install dependencies
npm install prisma @prisma/client

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed admin user (optional)
npx prisma db seed
```

### 4. Create Admin User Seed Script
Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)
  
  const admin = await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@greenhacker.tech' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@greenhacker.tech',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  })
  
  console.log('Admin user created:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 5. Update package.json
```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## 🔧 QUICK START COMMANDS

### For SQLite (Current - No changes needed):
```bash
npx prisma db push
npx prisma db seed
npm run dev
```

### For PostgreSQL Migration:
```bash
# 1. Update prisma/schema.prisma provider to "postgresql"
# 2. Add DATABASE_URL to .env.local
# 3. Run migrations
npx prisma db push
npx prisma db seed
npm run dev
```

## 🛠️ TROUBLESHOOTING

### Common Issues:
1. **Connection Refused**: Check database is running and credentials are correct
2. **Migration Errors**: Try `npx prisma db push --force-reset` (⚠️ deletes data)
3. **Auth Issues**: Verify NEXTAUTH_SECRET is set
4. **Seed Fails**: Check admin credentials in .env.local

### Database Tools:
- **Prisma Studio**: `npx prisma studio` (Visual database browser)
- **Database Backup**: Use your provider's backup tools
- **Migrations**: `npx prisma migrate dev` for development

## 📝 NEXT STEPS

1. **Choose your database** (PostgreSQL recommended)
2. **Set up environment variables**
3. **Run database migrations**
4. **Seed admin user**
5. **Test admin login**
6. **Deploy to production**

## 🔐 SECURITY NOTES

- ✅ Use strong passwords for admin accounts
- ✅ Set secure NEXTAUTH_SECRET (32+ characters)
- ✅ Use environment variables for all secrets
- ✅ Enable SSL in production database connections
- ✅ Regular database backups
- ✅ Monitor audit logs for suspicious activity
