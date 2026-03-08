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
    Preview,
    Hr
} from "@react-email/components";
import * as React from "react";

export default function ColdEmailTemplate({
    recipientName = "There",
    companyName = "your company",
    senderName = "Harsh Hirawat",
    senderTitle = "Software Engineer",
    bodyContent = "I wanted to reach out regarding potential opportunities."
}) {
    // A clean, professional, non-flashy template for cold outreach
    return (
        <Html>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#22c55e",
                                text: "#333333",
                                background: "#ffffff",
                                muted: "#666666",
                            },
                        },
                    },
                }}
            >
                <Head>
                    <style>{`
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                    `}</style>
                </Head>
                <Preview>Reach out regarding {companyName}</Preview>
                <Body className="bg-background my-auto mx-auto font-sans text-text">
                    <Container className="my-[40px] mx-auto max-w-[600px] bg-background">
                        <Section className="px-8 py-6">
                            <Text className="text-[15px] leading-[24px] text-text mb-4">
                                Hi {recipientName},
                            </Text>

                            <Text className="text-[15px] leading-[24px] text-text whitespace-pre-wrap mb-6">
                                {bodyContent}
                            </Text>

                            <Text className="text-[15px] leading-[24px] text-text mb-2">
                                Best regards,
                            </Text>

                            <Section className="mt-4">
                                <Text className="text-[16px] font-semibold text-text m-0">
                                    {senderName}
                                </Text>
                                <Text className="text-[13px] text-muted m-0">
                                    {senderTitle}
                                </Text>
                                <Link href="https://greenhacker.in" className="text-brand text-[13px] no-underline">
                                    greenhacker.in
                                </Link>
                                <Text className="text-[13px] text-muted m-0 space-x-2">
                                    <Link href="https://linkedin.com/in/harshhirawat" className="text-muted underline">LinkedIn</Link>
                                    <span>{' | '}</span>
                                    <Link href="https://github.com/GreenHacker420" className="text-muted underline">GitHub</Link>
                                </Text>
                            </Section>
                        </Section>

                        <Section className="bg-gray-50 px-8 py-6 rounded-b-lg border-t border-gray-100">
                            <Text className="text-xs text-gray-400 m-0 text-center">
                                This email was sent by {senderName}. If you'd prefer not to receive these emails, simply reply with "Unsubscribe".
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
