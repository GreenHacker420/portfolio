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
                <Preview>New Contact: {subject} — from {name}</Preview>
                <Body className="bg-black my-auto mx-auto font-sans text-white">
                    <Container className="my-[40px] mx-auto max-w-[600px] bg-black">

                        {/* Top accent with alert style */}
                        <Section className="h-[3px] w-full bg-gradient-to-r from-brand via-brand to-transparent" />

                        {/* Header */}
                        <Section className="bg-surface border-x border-border px-8 py-6 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/30 bg-brand/10 mb-4">
                                <div className="w-2 h-2 rounded-full bg-brand shadow-[0_0_8px_#22c55e]" />
                                <span className="text-brand text-[10px] font-mono uppercase tracking-[0.2em]">
                                    New Signal Detected
                                </span>
                            </div>
                            <Heading className="text-white text-[22px] font-semibold m-0 p-0 tracking-tight leading-tight">
                                {subject}
                            </Heading>
                            <Text className="text-zinc-500 text-xs mt-2 mb-0 font-mono">
                                {date}
                            </Text>
                        </Section>

                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border-light to-transparent" />

                        {/* Content */}
                        <Section className="bg-surface border-x border-border px-8 py-6">
                            {/* Sender Info */}
                            <Text className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em] mb-3">
                                Sender Details
                            </Text>
                            <div className="bg-surface-light border border-border-light rounded-lg p-4 mb-6">
                                <Row>
                                    <Column className="w-[48px]">
                                        <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-sm font-bold font-mono">
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                    </Column>
                                    <Column>
                                        <Text className="text-white text-base font-medium m-0 leading-tight">{name}</Text>
                                        <Text className="text-zinc-500 text-sm m-0 mt-0.5">{email}</Text>
                                    </Column>
                                </Row>
                            </div>

                            {/* Message */}
                            <Text className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em] mb-3">
                                Message Payload
                            </Text>
                            <div className="bg-surface-light border border-border-light rounded-lg p-5 mb-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-brand via-brand/50 to-transparent" />
                                <Text className="text-zinc-300 text-sm leading-[1.8] whitespace-pre-wrap m-0 pl-3 font-mono">
                                    {message}
                                </Text>
                            </div>

                            {/* Quick Actions */}
                            <div className="text-center">
                                <Link
                                    href={`mailto:${email}?subject=Re: ${subject}`}
                                    className="inline-block px-8 py-3 bg-brand text-black font-bold rounded-md text-sm no-underline mr-3"
                                >
                                    Reply to Signal
                                </Link>
                                <Link
                                    href="https://greenhacker.in/admin"
                                    className="inline-block px-6 py-3 bg-transparent border border-border-light text-zinc-400 rounded-md text-sm no-underline"
                                >
                                    Open Dashboard
                                </Link>
                            </div>
                        </Section>

                        {/* Footer */}
                        <Section className="bg-surface-light border-x border-b border-border rounded-b-lg">
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border-light to-transparent" />
                            <div className="px-8 py-4 text-center">
                                <Text className="text-zinc-700 text-[10px] font-mono m-0">
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
