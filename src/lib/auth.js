
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'

export const authOptions = {
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
                let user = await prisma.adminUser.findUnique({
                    where: { email: normalizedEmail }
                })

                // Auto-bootstrap a default admin if no admin users exist yet
                if (!user) {
                    const count = await prisma.adminUser.count()
                    if (count === 0) {
                        const email = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@greenhacker.in').toLowerCase()
                        const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
                        const hash = await bcrypt.hash(password, 10)
                        await prisma.adminUser.create({
                            data: { email, password: hash, name: 'Administrator', role: 'admin' }
                        })
                        // if the attempting email matches the bootstrap email, allow auth to proceed
                        if (normalizedEmail === email) {
                            user = await prisma.adminUser.findUnique({ where: { email } })
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
                session.user.id = token.id
                session.user.role = token.role
                session.user.email = token.email
                session.user.name = token.name
            }
            return session
        },
    },
    pages: {
        signIn: '/admin/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
}
