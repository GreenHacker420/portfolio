import SmoothScroll from "@/components/layout/SmoothScroll";
import "./globals.css";
import { Inter } from "next/font/google";
import ChatWidget from "@/components/ui/ChatWidget";
import { AuthProvider } from "@/components/providers/AuthProvider";
import siteMetadata from "./metadata";

const inter = Inter({ subsets: ["latin"] });

export const metadata = siteMetadata;

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
