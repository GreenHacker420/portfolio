import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GREENHACKER | Developer Portfolio',
  description: 'Full-stack developer portfolio showcasing modern web technologies, AI integration, and innovative projects.',
  keywords: ['developer', 'portfolio', 'React', 'Next.js', 'TypeScript', 'AI', 'machine learning'],
  authors: [{ name: 'GreenHacker' }],
  creator: 'GreenHacker',
  publisher: 'GreenHacker',
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://greenhacker.dev',
    title: 'GREENHACKER | Developer Portfolio',
    description: 'Full-stack developer portfolio showcasing modern web technologies, AI integration, and innovative projects.',
    siteName: 'GreenHacker Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GREENHACKER | Developer Portfolio',
    description: 'Full-stack developer portfolio showcasing modern web technologies, AI integration, and innovative projects.',
    creator: '@greenhacker',
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0d1117" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
