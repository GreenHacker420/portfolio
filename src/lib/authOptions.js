import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Hardcoded admin check
                const adminEmail = "hhirawat5@gmail.com";
                const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

                if (
                    credentials?.email === adminEmail &&
                    credentials?.password === adminPassword
                ) {
                    return {
                        id: "1",
                        name: "Harsh Hirawat",
                        email: adminEmail,
                        role: "admin",
                    };
                }

                return null;
            }
        })
    ],
    pages: {
        signIn: "/auth/sign-in",
        error: "/auth/sign-in", // Error code passed in query string as ?error=
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
