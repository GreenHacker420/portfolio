import { Text, Hr, Section, Container } from "@react-email/components";
import * as React from "react";
import {
    EmailLayout,
    GridBackground,
    SystemHeader,
    SignalBadge,
    TerminalCard,
    ActionButtons,
    FooterSignature
} from "./components";

export default function AdminTemplate({
    name = "Unknown Protocol",
    email = "classified@network.local",
    message = "Encrypted transmission omitted.",
    subject = "UNIDENTIFIED PING",
}) {
    return (
        <EmailLayout previewText={`NEW SIGNAL DETECTED: ${subject}`}>
            <GridBackground footer={<FooterSignature />}>

                <SignalBadge text="New Node Detected" />

                <SystemHeader title="Unidentified" highlight="Ping" date="Admin Alert" />

                <TerminalCard>
                    <Text className="text-brand-dim text-sm mb-2 font-mono flex items-center gap-2">
                        <span className="text-brand">➜</span> <span className="text-zinc-400">~/admin/incoming</span>
                    </Text>

                    <Text className="text-white text-[18px] mb-4 leading-relaxed font-medium">
                        Node Identity:
                    </Text>

                    {/* Sender Info Block */}
                    <Section className="bg-black/40 border border-white/5 rounded-md p-4 mb-6 w-full">
                        <Text className="text-zinc-300 text-[14px] font-mono m-0 mb-2">
                            <span className="text-zinc-500">USR:</span> {name}
                        </Text>
                        <Text className="text-zinc-300 text-[14px] font-mono m-0 mb-2">
                            <span className="text-zinc-500">NET:</span> <a href={`mailto:${email}`} className="text-brand no-underline">{email}</a>
                        </Text>
                        <Text className="text-zinc-300 text-[14px] font-mono m-0">
                            <span className="text-zinc-500">SUB:</span> <span className="text-white">{subject}</span>
                        </Text>
                    </Section>

                    <Hr className="border-border-light my-6" />

                    <Text className="text-brand-dim text-sm mb-2 font-mono">Payload:</Text>
                    <Text className="text-zinc-300 text-[15px] leading-[1.8] font-light bg-[#050505] p-4 rounded-md border border-white/5 whitespace-pre-wrap">
                        {message}
                    </Text>
                </TerminalCard>

                <ActionButtons
                    primaryLabel="Investigate Payload"
                    primaryHref={`mailto:${email}`}
                    secondaryLabel="Initialize Handshake"
                    secondaryHref={`mailto:${email}`}
                />

            </GridBackground>
        </EmailLayout>
    );
}
