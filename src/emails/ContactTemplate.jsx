
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
    customerName = "Developer",
    replyMessage = "Thank you for reaching out. We have received your message and will get back to you shortly.",
}) {
    return (
        <Html>
            <Head />
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#22c55e", // Green-500
                                background: "#000000",
                                surface: "#111111",
                            },
                        },
                    },
                }}
            >
                <Body className="bg-background my-auto mx-auto font-mono text-white">
                    <Container className="border border-brand/20 rounded-lg my-[40px] mx-auto p-[20px] max-w-2xl bg-surface shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <Section className="mt-[32px]">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-3 h-3 rounded-full bg-red-500/50 inline-block mr-2" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50 inline-block mr-2" />
                                <div className="w-3 h-3 rounded-full bg-brand/50 inline-block" />
                            </div>
                            <Heading className="text-brand text-[24px] font-normal text-center p-0 my-[30px] mx-0 uppercase tracking-widest">
                                System Notification
                            </Heading>
                        </Section>

                        <Section>
                            <Text className="text-gray-300 text-[16px] leading-[24px]">
                                Hello {customerName},
                            </Text>

                            <Text className="text-gray-300 text-[16px] leading-[24px] mb-8">
                                {replyMessage}
                            </Text>

                            <div className="h-px w-full bg-brand/30 my-6" />

                            <Text className="text-brand/70 text-[12px] uppercase">
                                Secure Transmission // End of Line
                            </Text>
                        </Section>

                        <Section className="mt-8 text-center">
                            <Link href="https://greenhacker.dev" className="text-brand hover:underline text-sm">
                                greenhacker.dev
                            </Link>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
