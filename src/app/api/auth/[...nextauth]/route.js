import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (
                    credentials.username === process.env.ADMIN_USER &&
                    credentials.password === process.env.ADMIN_PASSWORD
                ) {
                    return { id: "1", name: "Admin", email: "admin@example.com" };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin", // Uses default for now or we can create one
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
