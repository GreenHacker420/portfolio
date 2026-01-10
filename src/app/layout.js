import SmoothScroll from "@/components/layout/SmoothScroll";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Harsh | Creative Developer",
    description: "Impactful Developer Portfolio building the future of web.",
};

import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <AuthProvider>
                    <SmoothScroll>
                        {children}
                    </SmoothScroll>
                </AuthProvider>
            </body>
        </html>
    );
}
