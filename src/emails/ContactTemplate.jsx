import {
    Html,
    Body,
    Head,
    Heading,
    Container,
    Text,
    Link,
    Tailwind,
    Section,
    Img,
    Hr,
    Preview,
} from "@react-email/components";
import * as React from "react";

export default function ContactReplyEmail({
    customerName = "Fellow Traveler",
    replyMessage = "We have received your transmission. Our systems are analyzing your request. Stand by for a handshake.",
}) {
    return (
        <Html>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#22c55e",
                                "brand-dim": "#15803d",
                                background: "#000000",
                                surface: "#0a0a0a",
                                "surface-light": "#141414",
                                border: "#1e1e1e",
                                "border-light": "#2a2a2a",
                            },
                        },
                    },
                }}
            >
                <Head>
                    <style>{`
                        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600&display=swap');
                    `}</style>
                </Head>
                <Preview>Transmission Received — GreenHacker</Preview>
                <Body className="bg-black my-auto mx-auto font-sans text-white">
                    <Container className="my-[40px] mx-auto max-w-[520px] bg-black">

                        {/* Glowing top accent */}
                        <Section className="h-[3px] w-full bg-gradient-to-r from-transparent via-brand to-transparent" />

                        <Section className="bg-surface border-x border-border p-10 text-center">
                            {/* Status badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/20 bg-brand/5 mb-8">
                                <div className="w-2 h-2 rounded-full bg-brand shadow-[0_0_8px_#22c55e]" />
                                <span className="text-brand text-[10px] font-mono uppercase tracking-[0.25em]">
                                    System Online
                                </span>
                            </div>

                            {/* Logo */}
                            <Heading className="text-white text-[28px] font-light mb-0 tracking-tight leading-tight">
                                Green<span className="text-brand font-bold">Hacker</span>
                            </Heading>
                            <Text className="text-zinc-600 text-[11px] uppercase tracking-[0.35em] mt-1 mb-10 font-mono">
                                Transmission Received
                            </Text>

                            {/* Message Card */}
                            <div className="border border-border-light bg-surface-light rounded-lg p-6 text-left relative overflow-hidden">
                                {/* Top glow line */}
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

                                <Text className="text-zinc-500 text-sm mb-1 font-mono">
                                    <span className="text-brand-dim">$</span> hello
                                </Text>
                                <Text className="text-zinc-300 text-[15px] mb-4 leading-relaxed">
                                    Hey <span className="text-white font-medium">{customerName}</span>,
                                </Text>
                                <Text className="text-zinc-400 text-sm leading-[1.7]">
                                    {replyMessage}
                                </Text>

                                <Hr className="border-border my-5" />

                                <Text className="text-zinc-600 text-xs font-mono">
                                    <span className="text-brand-dim">→</span> You can expect a response within 24 hours.
                                </Text>
                            </div>

                            {/* CTA */}
                            <Section className="mt-8 mb-4">
                                <Link
                                    href="https://greenhacker.in"
                                    className="inline-block px-6 py-2.5 bg-brand/10 border border-brand/30 rounded-md text-brand text-xs font-mono uppercase tracking-wider no-underline hover:bg-brand/20"
                                >
                                    → Return to Terminal
                                </Link>
                            </Section>
                        </Section>

                        {/* Footer */}
                        <Section className="bg-surface border-x border-b border-border rounded-b-lg">
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border-light to-transparent" />
                            <div className="px-8 py-5 text-center">
                                {/* Social links */}
                                <div className="mb-3">
                                    <Link href="https://github.com/GreenHacker420" className="text-zinc-600 text-xs no-underline mx-2 hover:text-brand">GitHub</Link>
                                    <span className="text-zinc-800">·</span>
                                    <Link href="https://linkedin.com/in/harsh-hirawat" className="text-zinc-600 text-xs no-underline mx-2 hover:text-brand">LinkedIn</Link>
                                    <span className="text-zinc-800">·</span>
                                    <Link href="https://greenhacker.in" className="text-zinc-600 text-xs no-underline mx-2 hover:text-brand">Portfolio</Link>
                                </div>
                                <Text className="text-zinc-700 text-[10px] m-0 font-mono">
                                    TX-{Math.random().toString(36).substring(2, 8).toUpperCase()} // END_OF_LINE
                                </Text>
                            </div>
                        </Section>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
