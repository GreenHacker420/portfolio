# Mock Database - Filesystem Fallback

This directory contains a filesystem-based mock database that serves as a fallback when PostgreSQL is unavailable.

## 📁 Directory Structure

```
mock/
├── data/                    # JSON files containing mock data
│   ├── admin-users.json
│   ├── personal-info.json
│   ├── skills.json
│   ├── projects.json
│   ├── work-experience.json
│   ├── education.json
│   ├── certifications.json
│   ├── achievements.json
│   ├── contacts.json
│   ├── social-links.json
│   ├── faqs.json
│   ├── email-templates.json
│   └── system-settings.json
└── README.md               # This file
```

## 🚀 Usage

### Automatic Fallback

The application automatically switches to mock database mode when:

1. `DATABASE_URL` environment variable is not set
2. `USE_MOCK_DB=true` is set in environment variables
3. PostgreSQL connection fails

### Manual Activation

To explicitly use the mock database, add to your `.env.local`:

```bash
USE_MOCK_DB=true
```

### Disabling Fallback

To disable the fallback and require PostgreSQL:

```bash
# Remove or comment out
# USE_MOCK_DB=true

# Ensure DATABASE_URL is set
DATABASE_URL="postgresql://user:password@host:port/database"
```

## 📝 Data Format

Each JSON file contains an array of records following the Prisma schema structure:

```json
[
  {
    "id": "unique_id",
    "field1": "value1",
    "field2": "value2",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## ✨ Features

### Supported Operations

- ✅ `findMany` - Find multiple records with filtering, sorting, pagination
- ✅ `findUnique` - Find a single record by unique field
- ✅ `findFirst` - Find the first matching record
- ✅ `create` - Create a new record
- ✅ `update` - Update a single record
- ✅ `updateMany` - Update multiple records
- ✅ `delete` - Delete a single record
- ✅ `deleteMany` - Delete multiple records
- ✅ `count` - Count records
- ✅ `upsert` - Update or create a record

### Query Features

- **Where Clauses**: Supports `equals`, `contains`, `in`, `not`, `gt`, `gte`, `lt`, `lte`
- **Ordering**: Sort by one or multiple fields (asc/desc)
- **Pagination**: `skip` and `take` for pagination
- **Selection**: Select specific fields with `select`
- **Filtering**: Complex where conditions

### Limitations

- ❌ No support for raw SQL queries (`$queryRaw`, `$executeRaw`)
- ❌ No support for relations (include/connect)
- ❌ No support for transactions
- ❌ No support for aggregations (sum, avg, etc.)
- ❌ Limited query operators compared to PostgreSQL

## 🔧 Customization

### Adding New Data

1. Create a new JSON file in `mock/data/` with the model name in kebab-case:
   ```
   mock/data/your-model-name.json
   ```

2. Add sample data following the schema:
   ```json
   [
     {
       "id": "model_001",
       "field": "value",
       "createdAt": "2024-01-01T00:00:00.000Z",
       "updatedAt": "2024-01-01T00:00:00.000Z"
     }
   ]
   ```

3. The mock database will automatically load it on initialization

### Modifying Existing Data

Simply edit the JSON files in `mock/data/`. Changes will be persisted when records are created, updated, or deleted through the API.

## 🔍 Debugging

### Check Current Mode

The application logs which database mode it's using on startup:

```
✅ Connected to PostgreSQL database
```

or

```
📁 Using mock filesystem database
```

### Force Mock Mode

You can programmatically switch to mock mode:

```typescript
import { db } from '@/lib/dbClient';

await db.switchToMock();
console.log('Current mode:', db.getMode()); // 'mock'
```

## 📊 Performance

The mock database:

- Loads all data into memory on initialization
- Writes changes back to JSON files asynchronously
- Suitable for development and testing
- **Not recommended for production use**

## 🔐 Security

- Mock data is stored in plain JSON files
- Passwords in `admin-users.json` should be hashed (bcrypt)
- Do not commit sensitive data to version control
- Add `mock/data/*.json` to `.gitignore` if needed

## 🧪 Testing

The mock database is ideal for:

- Local development without PostgreSQL
- CI/CD pipelines
- Integration tests
- Demo environments
- Offline development

## 🚨 Important Notes

1. **Data Persistence**: Changes are saved to JSON files and persist across restarts
2. **Concurrency**: Not designed for concurrent access
3. **Performance**: Slower than PostgreSQL for large datasets
4. **Production**: Do not use in production environments
5. **Backup**: Regularly backup your mock data files

## 🔄 Migration Path

When ready to switch to PostgreSQL:

1. Set up your PostgreSQL database
2. Run Prisma migrations: `npx prisma migrate dev`
3. Seed the database: `npx prisma db seed`
4. Remove `USE_MOCK_DB=true` from environment
5. Set proper `DATABASE_URL`

The application will automatically use PostgreSQL on next restart.

## 📚 Example Usage

```typescript
import { prisma } from '@/lib/db';

// Works with both PostgreSQL and mock database
const skills = await prisma.skill.findMany({
  where: { isVisible: true },
  orderBy: { displayOrder: 'asc' },
  take: 10
});

const project = await prisma.project.create({
  data: {
    title: 'New Project',
    description: 'Description',
    category: 'web-app',
    status: 'published'
  }
});
```

## 🆘 Troubleshooting

### Mock database not loading

- Check that `mock/data/` directory exists
- Ensure JSON files are valid
- Check console for initialization errors

### Data not persisting

- Verify write permissions on `mock/data/` directory
- Check for JSON syntax errors
- Review console logs for save errors

### Performance issues

- Reduce the amount of mock data
- Consider using PostgreSQL for better performance
- Implement pagination in your queries

## 📞 Support

For issues or questions:
- Check the main project README
- Review the database client code in `src/lib/dbClient.ts`
- Check application logs for error messages
