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
                                background: "#000000",
                                surface: "#09090b",
                                border: "#27272a"
                            },
                        },
                    },
                }}
            >
                <Head />
                <Body className="bg-black my-auto mx-auto font-mono text-white">
                    <Container className="border-x border-b border-brand/20 my-[40px] mx-auto max-w-[500px] bg-black relative">
                        {/* Top Bar Decoration */}
                        <Section className="h-1 w-full bg-brand shadow-[0_0_15px_rgba(34,197,94,0.5)]" />

                        <Section className="p-10 text-center">
                            {/* Animated-style Status Indicator */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/30 bg-brand/5 mb-8">
                                <div className="w-2 h-2 rounded-full bg-brand animate-pulse shadow-[0_0_10px_#22c55e]" />
                                <span className="text-brand text-[10px] uppercase tracking-[0.2em]">Online</span>
                            </div>

                            <Heading className="text-white text-[32px] font-light mb-2 tracking-tighter">
                                Green<span className="text-brand font-bold">Hacker</span>
                            </Heading>
                            <Text className="text-zinc-500 text-xs uppercase tracking-[0.3em] mb-12">
                                Transmission Received
                            </Text>

                            <div className="border border-zinc-800 bg-zinc-900/30 p-6 text-left relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-50" />

                                <Text className="text-zinc-400 text-sm mb-4">
                                    Hello <span className="text-white">{customerName}</span>,
                                </Text>
                                <Text className="text-zinc-300 text-sm leading-relaxed">
                                    {replyMessage}
                                </Text>
                            </div>

                            <Section className="mt-12">
                                <Link href="https://greenhacker.dev" className="text-zinc-600 hover:text-brand text-[10px] uppercase tracking-widest no-underline transition-colors">
                                    Return to Terminal
                                </Link>
                            </Section>
                        </Section>

                        {/* Scanline Effect (CSS Simulation in Email is hard, using border) */}
                        <div className="h-px w-full bg-zinc-900" />
                        <Section className="bg-zinc-950 p-4 text-center">
                            <Text className="text-zinc-700 text-[10px]">
                                ID: {Math.random().toString(36).substring(7).toUpperCase()} // END_OF_LINE
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
