import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@greenhacker.tech'
  const password = 'admin123' // Change this in production
  const name = 'Admin User'

  // Check if admin user already exists
  const existingUser = await prisma.adminUser.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.log('Admin user already exists')
    return
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create admin user
  const adminUser = await prisma.adminUser.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'admin'
    }
  })

  console.log('Admin user created:', adminUser.email)
  console.log('Password:', password)
  console.log('Please change the password after first login!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
