import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import StructuredData from '@/components/seo/StructuredData';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import WebVitals from '@/components/performance/WebVitals';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0d1117',
  viewportFit: 'cover'
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NETLIFY_URL
    ? process.env.NETLIFY_URL
    : process.env.NODE_ENV === 'production'
    ? 'https://greenhacker.tech'
    : 'http://localhost:3000'),
  title: {
    default: 'GREENHACKER | Developer Portfolio',
    template: '%s | GreenHacker Portfolio'
  },
  description: 'Full-stack developer portfolio showcasing modern web technologies, AI integration, and innovative projects. Specializing in React, Next.js, TypeScript, Python, and machine learning solutions.',
  keywords: [
    'developer', 'portfolio', 'React', 'Next.js', 'TypeScript', 'AI', 'machine learning',
    'full-stack developer', 'web development', 'software engineer', 'JavaScript', 'Python',
    'Three.js', 'GSAP', 'Tailwind CSS', 'Node.js', 'GitHub', 'open source'
  ],
  authors: [{ name: 'GreenHacker', url: 'https://greenhacker.tech' }],
  creator: 'GreenHacker',
  publisher: 'GreenHacker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/logo.jpg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/logo.jpg', sizes: '16x16', type: 'image/jpeg' }
    ],
    shortcut: '/logo.jpg',
    apple: [
      { url: '/logo.jpg', sizes: '180x180', type: 'image/jpeg' }
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://greenhacker.tech',
    title: 'GREENHACKER | Developer Portfolio',
    description: 'Full-stack developer portfolio showcasing modern web technologies, AI integration, and innovative projects.',
    siteName: 'GreenHacker Portfolio',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'GreenHacker Portfolio - Full-Stack Developer',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GREENHACKER | Developer Portfolio',
    description: 'Full-stack developer portfolio showcasing modern web technologies, AI integration, and innovative projects.',
    creator: '@greenhacker',
    images: ['/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://greenhacker.tech',
    types: {
      'application/rss+xml': 'https://greenhacker.tech/feed.xml',
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || 'your-google-verification-code',
    yandex: process.env.YANDEX_VERIFICATION,
  },
  category: 'technology',
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
        <meta name="msapplication-TileColor" content="#0d1117" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="canonical" href="https://greenhacker.tech" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "GreenHacker",
              jobTitle: "Full-Stack Developer & AI Specialist",
              description: "Experienced full-stack developer specializing in modern web technologies, AI integration, and innovative software solutions. Proficient in React, Next.js, TypeScript, Python, and machine learning.",
              url: "https://greenhacker.tech",
              sameAs: [
                "https://github.com/GreenHacker420",
                "https://linkedin.com/in/harsh-hirawat-b657061b7",
                "https://codeforces.com/profile/GreenHacker",
                "https://leetcode.com/u/greenhacker420/"
              ],
              knowsAbout: [
                "JavaScript", "TypeScript", "React", "Next.js", "Python",
                "Machine Learning", "Artificial Intelligence", "Full-Stack Development",
                "Web Development", "Software Engineering", "Node.js", "Three.js",
                "GSAP", "Tailwind CSS"
              ],
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "Computer Science Education"
              }
            })
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "GreenHacker Portfolio",
              description: "Professional portfolio showcasing full-stack development projects, AI integrations, and modern web technologies.",
              url: "https://greenhacker.tech",
              author: {
                "@type": "Person",
                name: "GreenHacker"
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://greenhacker.tech/?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "GreenHacker Development",
              description: "Professional software development services specializing in full-stack web applications and AI-powered solutions.",
              url: "https://greenhacker.tech",
              logo: "https://greenhacker.tech/logo.jpg",
              founder: {
                "@type": "Person",
                name: "GreenHacker"
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "harsh@greenhacker.tech",
                contactType: "Professional Inquiries"
              }
            })
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <GoogleAnalytics />
        <StructuredData />
        <WebVitals />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
