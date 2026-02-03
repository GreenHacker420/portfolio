const siteMetadata = {
    metadataBase: new URL('https://greenhacker.in'),
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
        icon: "/logo.jpg",
        shortcut: "/logo.jpg",
        apple: "/logo.jpg",
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

export default siteMetadata;
