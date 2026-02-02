
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
                                brand: "#22c55e", // Green-500
                                background: "#000000",
                                surface: "#09090b",
                                border: "#27272a"
                            },
                        },
                    },
                }}
            >
                <Head />
                <Body className="bg-black my-auto mx-auto font-sans text-white">
                    <Container className="border border-border rounded-xl my-[40px] mx-auto p-[0px] max-w-[600px] bg-surface overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                        {/* Header */}
                        <Section className="bg-zinc-900/50 p-8 border-b border-border text-center">
                            <div className="flex justify-center mb-4">
                                <div className="inline-block px-3 py-1 rounded-full border border-brand/30 bg-brand/10 text-brand text-xs font-mono tracking-widest uppercase">
                                    New Signal Detected
                                </div>
                            </div>
                            <Heading className="text-white text-[24px] font-bold m-0 p-0 tracking-tight">
                                {subject}
                            </Heading>
                            <Text className="text-zinc-500 text-sm mt-2 mb-0 font-mono">
                                {date}
                            </Text>
                        </Section>

                        {/* Content */}
                        <Section className="p-8">
                            <Text className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-4">
                                Sender Details
                            </Text>
                            <Row className="mb-6">
                                <Column>
                                    <div className="p-4 bg-black border border-border rounded-lg">
                                        <Text className="text-brand text-xs font-mono uppercase mb-1">From</Text>
                                        <Text className="text-white text-base font-medium m-0">{name}</Text>
                                        <Text className="text-zinc-500 text-sm m-0">{email}</Text>
                                    </div>
                                </Column>
                            </Row>

                            <Text className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-4">
                                Message Payload
                            </Text>
                            <div className="p-6 bg-black border border-border rounded-lg mb-8">
                                <Text className="text-zinc-300 text-base leading-relaxed whitespace-pre-wrap m-0 font-mono">
                                    {message}
                                </Text>
                            </div>

                            <div className="text-center">
                                <Link
                                    href={`mailto:${email}?subject=Re: ${subject}`}
                                    className="inline-block px-8 py-3 bg-brand text-black font-bold rounded-md text-sm hover:bg-brand/90 transition-colors no-underline"
                                >
                                    Reply to Signal
                                </Link>
                            </div>
                        </Section>

                        {/* Footer */}
                        <Section className="bg-zinc-900/30 p-6 border-t border-border text-center">
                            <Text className="text-zinc-600 text-xs font-mono m-0">
                                SECURE TRANSMISSION // ADMIN EYES ONLY
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
