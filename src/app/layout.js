import SmoothScroll from "@/components/layout/SmoothScroll";
import "./globals.css";
import { Inter } from "next/font/google";
import ChatWidget from "@/components/ui/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    metadataBase: new URL('https://greenhacker.dev'),
    title: {
        default: "Harsh | Creative Developer",
        template: "%s | Harsh Hirawat"
    },
    description: "Creative Developer & UI/UX Designer building immersive digital experiences. Specialized in Next.js, React, and 3D web technologies, Agentic AI.",
    keywords: ["Creative Developer", "Web Developer", "React Developer", "Next.js", "Three.js", "Frontend Developer", "Harsh Hirawat", "GreenHacker", "Portfolio"],
    authors: [{ name: "Harsh Hirawat", url: "https://greenhacker.in" }],
    creator: "Harsh Hirawat",
    publisher: "Harsh Hirawat",
    openGraph: {
        title: "Harsh | Creative Developer",
        description: "Impactful Developer Portfolio building the future of web with immersive 3D experiences.",
        url: "https://greenhacker.in",
        siteName: "Harsh Hirawat Portfolio",
        images: [
            {
                url: "/logo.png",
                width: 1200,
                height: 630,
                alt: "Harsh Hirawat Portfolio Preview",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Harsh | Creative Developer",
        description: "Impactful Developer Portfolio building the future of web.",
        creator: "@GreenHacker420",
        images: ["/logo.png"],
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={inter.className}>
                <AuthProvider>
                    <SmoothScroll>
                        {children}
                    </SmoothScroll>
                    <ChatWidget />
                </AuthProvider>
            </body>
        </html>
    );
}
