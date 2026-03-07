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
    Row,
    Column,
    Preview,
} from "@react-email/components";
import * as React from "react";

export default function AdminTemplate({
    name = "Ghost User",
    email = "ghost@shell.com",
    subject = "System Breach Attempt",
    message = "I found a vulnerability in your mainframe.",
    date = new Date().toLocaleString()
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
                <Preview>New Contact: {subject} — from {name}</Preview>
                <Body className="bg-background my-auto mx-auto font-sans text-white">
                    <Container className="my-[40px] mx-auto max-w-[600px] bg-background">

                        {/* React Bits inspired: Gradient glowing top bar */}
                        <Section className="h-[4px] w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 blur-[1px]" />
                        <Section className="h-[1px] w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />

                        {/* Header */}
                        <Section className="bg-surface border-x border-border px-8 py-8 text-center grid-bg relative overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.05)]">
                            {/* React Bits inspired: Soft blur background spotlight */}
                            <div className="absolute top-[-50px] left-1/2 ml-[-150px] w-[300px] h-[100px] bg-brand-glow blur-[60px] rounded-full pointer-events-none" />

                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 relative z-10 shadow-lg">
                                <div className="w-2 h-2 rounded-full bg-brand shadow-[0_0_10px_#22c55e] animate-pulse" />
                                <span className="text-zinc-300 text-[11px] font-mono uppercase tracking-[0.2em]">
                                    New Signal Detected
                                </span>
                            </div>

                            <Heading className="text-white text-[28px] font-bold m-0 p-0 tracking-tight leading-tight relative z-10 text-gradient">
                                {subject}
                            </Heading>
                            <Text className="text-brand-dim text-xs mt-3 mb-0 font-mono relative z-10">
                                {date}
                            </Text>
                        </Section>

                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border-light to-transparent" />

                        {/* Content */}
                        <Section className="bg-surface border-x border-border px-8 py-8">
                            {/* Sender Info */}
                            <Text className="text-zinc-500 text-[10.5px] font-mono uppercase tracking-[0.25em] mb-4">
                                Sender Details
                            </Text>

                            {/* Profile Card Mockup */}
                            <div className="bg-surface-light border border-white/10 rounded-xl p-5 mb-8 shadow-xl relative overflow-hidden">
                                {/* Top inner glow line */}
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

                                <Row>
                                    <Column className="w-[52px]">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand/20 to-blue-500/20 border border-brand/30 flex items-center justify-center text-brand text-lg font-bold shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                    </Column>
                                    <Column>
                                        <Text className="text-white text-[17px] font-semibold m-0 leading-tight">{name}</Text>
                                        <Text className="text-zinc-400 text-[14px] m-0 mt-1">{email}</Text>
                                    </Column>
                                </Row>
                            </div>

                            {/* Message */}
                            <Text className="text-zinc-500 text-[10.5px] font-mono uppercase tracking-[0.25em] mb-4">
                                Message Payload
                            </Text>

                            {/* Depth Card Mockup */}
                            <div className="bg-surface-light border border-white/10 rounded-xl p-6 mb-8 relative shadow-xl overflow-hidden">
                                {/* Side gradient bar */}
                                <div className="absolute top-0 left-0 w-[4px] h-full bg-gradient-to-b from-brand via-blue-500 to-brand" />
                                {/* Bottom inner glow line */}
                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

                                <Text className="text-zinc-300 text-[15px] leading-[1.8] whitespace-pre-wrap m-0 pl-3 font-mono font-light">
                                    {message}
                                </Text>
                            </div>

                            {/* Quick Actions */}
                            <div className="text-center mt-6">
                                <Link
                                    href={`mailto:${email}?subject=Re: ${subject}`}
                                    className="inline-block px-8 py-3.5 bg-brand text-black font-bold tracking-wide rounded-lg text-sm no-underline mr-4 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:brightness-110 transition-all border border-brand/50"
                                >
                                    Reply to Signal
                                </Link>
                                <Link
                                    href="https://greenhacker.in/admin"
                                    className="inline-block px-8 py-3.5 bg-black border border-border-light text-zinc-300 font-medium rounded-lg text-sm no-underline hover:bg-surface-light transition-all"
                                >
                                    Open Dashboard
                                </Link>
                            </div>
                        </Section>

                        {/* Footer */}
                        <Section className="bg-surface-light border-x border-b border-border rounded-b-xl relative overflow-hidden">
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border-light to-transparent" />
                            <div className="px-8 py-6 text-center">
                                <Text className="text-zinc-600 text-[10px] font-mono m-0 tracking-widest">
                                    SECURE TRANSMISSION // ADMIN EYES ONLY
                                </Text>
                            </div>
                        </Section>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
