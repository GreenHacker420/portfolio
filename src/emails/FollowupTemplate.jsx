import {
    Html,
    Body,
    Head,
    Container,
    Text,
    Link,
    Tailwind,
    Section,
    Preview,
} from "@react-email/components";
import * as React from "react";

export default function FollowupTemplate({
    recipientName = "There",
    subjectReference = "our previous email",
    bodyContent = "I'm following up on my previous message.",
    senderName = "Harsh Hirawat"
}) {
    // Highly simplistic, natural-looking follow-up
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
                <Preview>Following up: {subjectReference}</Preview>
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
                                Best,
                            </Text>

                            <Text className="text-[15px] font-medium text-text mt-1">
                                {senderName}
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
