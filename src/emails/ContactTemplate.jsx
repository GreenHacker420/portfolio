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
                                "brand-glow": "rgba(34, 197, 94, 0.4)",
                                background: "#050505",
                                surface: "#0a0a0b",
                                "surface-light": "#121214",
                                border: "#1f1f22",
                                "border-light": "#2a2a2e",
                            },
                        },
                    },
                }}
            >
                <Head>
                    <style>{`
                        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600&display=swap');
                        .text-gradient {
                            background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                        }
                        .aurora-gradient {
                            background: linear-gradient(135deg, #22c55e 0%, #10b981 50%, #3b82f6 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                        }
                        .grid-bg {
                            background-size: 30px 30px;
                            background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                        }
                    `}</style>
                </Head>
                <Preview>Transmission Received — GreenHacker</Preview>
                <Body className="bg-background my-auto mx-auto font-sans text-white">
                    <Container className="my-[40px] mx-auto max-w-[560px] bg-background">

                        {/* React Bits inspired: Gradient glowing top bar */}
                        <Section className="h-[4px] w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 blur-[1px]" />
                        <Section className="h-[1px] w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />

                        <Section className="bg-surface border-x border-b border-border p-10 text-center grid-bg shadow-[0_0_40px_rgba(34,197,94,0.05)] relative overflow-hidden">
                            {/* React Bits inspired: Soft blur background globe/spotlight */}
                            <div className="absolute top-[-50px] left-1/2 ml-[-100px] w-[200px] h-[100px] bg-brand-glow blur-[60px] rounded-full pointer-events-none" />

                            {/* Status badge - Glassmorphism style */}
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 relative z-10 shadow-lg">
                                <div className="w-2 h-2 rounded-full bg-brand shadow-[0_0_10px_#22c55e] animate-pulse" />
                                <span className="text-zinc-300 text-[11px] font-mono uppercase tracking-[0.2em]">
                                    System Protocol Active
                                </span>
                            </div>

                            {/* Logo with Aurora text */}
                            <Heading className="text-white text-[32px] font-bold mb-0 tracking-tight leading-tight relative z-10">
                                Green<span className="aurora-gradient">Hacker</span>
                            </Heading>
                            <Text className="text-zinc-500 text-[11px] uppercase tracking-[0.4em] mt-2 mb-10 font-mono relative z-10">
                                Transmission Received
                            </Text>

                            {/* React Bits inspired: Chroma Card / Depth Card */}
                            <div className="border border-white/10 bg-surface-light rounded-xl p-8 text-left relative overflow-hidden shadow-2xl z-10">
                                {/* Top inner glow line */}
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
                                {/* Bottom inner glow line */}
                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-brand/20 via-blue-500/20 to-brand/20" />

                                <Text className="text-brand-dim text-sm mb-2 font-mono flex items-center gap-2">
                                    <span className="text-brand">➜</span> <span className="text-zinc-400">~/contact/init</span>
                                </Text>

                                <Text className="text-gradient text-[18px] mb-4 leading-relaxed font-medium">
                                    Hey {customerName},
                                </Text>

                                <Text className="text-zinc-300 text-[15px] leading-[1.8] font-light">
                                    {replyMessage}
                                </Text>

                                <Hr className="border-border-light my-6" />

                                <Text className="text-zinc-500 text-xs font-mono bg-black/40 p-3 rounded-md border border-white/5">
                                    <span className="text-brand-dim">ETA:</span> Expect a response within one Earth rotation (24h).
                                </Text>
                            </div>

                            {/* CTA Button - Cyber style */}
                            <Section className="mt-10 mb-2 relative z-10">
                                <Link
                                    href="https://greenhacker.in"
                                    className="inline-block px-8 py-3 bg-brand/10 border border-brand/40 rounded-lg text-brand text-xs font-mono uppercase tracking-widest no-underline hover:bg-brand/20 shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all"
                                >
                                    Return to Terminal
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
                                    <Link href="https://linkedin.com/in/harshhirawat" className="text-zinc-600 text-xs no-underline mx-2 hover:text-brand">LinkedIn</Link>
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
