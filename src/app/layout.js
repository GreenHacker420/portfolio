import SmoothScroll from "@/components/layout/SmoothScroll";
import "./globals.css";
import { Inter } from "next/font/google";
import ChatWidget from "@/components/ui/ChatWidget";
import { AuthProvider } from "@/components/providers/AuthProvider";
import siteMetadata from "./metadata";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata = siteMetadata;

export default function RootLayout({ children }) {
    const TrackerScript = dynamic(() => import("@/components/analytics/TrackerScript"), { ssr: false });

    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={inter.className}>
                <AuthProvider>
                    <SmoothScroll>
                        {children}
                    </SmoothScroll>
                    <TrackerScript />
                    <ChatWidget />
                </AuthProvider>
            </body>
        </html>
    );
}
