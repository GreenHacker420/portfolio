import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const normalizedEmail = credentials.email.toLowerCase()
        let user = await directPrisma.adminUser.findUnique({
          where: { email: normalizedEmail }
        })

        // Auto-bootstrap a default admin if no admin users exist yet
        if (!user) {
          const count = await directPrisma.adminUser.count()
          if (count === 0) {
            const email = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@greenhacker.tech').toLowerCase()
            const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
            const hash = await bcrypt.hash(password, 10)
            await directPrisma.adminUser.create({
              data: { email, password: hash, name: 'Administrator', role: 'admin' }
            })
            // if the attempting email matches the bootstrap email, allow auth to proceed
            if (normalizedEmail === email) {
              user = await directPrisma.adminUser.findUnique({ where: { email } })
            }
          }
        }

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) {
          return null
        }

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        // Use the actual user ID from the database
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
