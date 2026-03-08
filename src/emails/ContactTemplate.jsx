import * as React from "react";
import { Text, Hr } from "@react-email/components";
import {
    EmailLayout,
    GridBackground,
    SystemHeader,
    SignalBadge,
    TerminalCard,
    StatusBlock,
    ActionButtons,
    FooterSignature
} from "./components";

export default function ContactTemplate({
    customerName = "Fellow Traveler",
    replyMessage = "We have received your transmission. Our systems are analyzing your request. Stand by for a handshake.",
}) {
    return (
        <EmailLayout previewText="Transmission Received — GreenHacker">
            <GridBackground footer={<FooterSignature />}>

                <SignalBadge text="System Protocol Active" />

                <SystemHeader title="GreenHacker" date="Transmission Received" />

                <TerminalCard>
                    <Text className="text-brand-dim text-sm mb-2 font-mono flex items-center gap-2">
                        <span className="text-brand">➜</span> <span className="text-zinc-400">~/contact/init</span>
                    </Text>

                    <Text className="text-white text-[18px] mb-4 leading-relaxed font-medium">
                        Hey {customerName},
                    </Text>

                    <Text className="text-zinc-300 text-[15px] leading-[1.8] font-light">
                        {replyMessage}
                    </Text>

                    <Hr className="border-border-light my-6" />

                    <StatusBlock label="ETA:" value="Expect a response within one Earth rotation (24h)." />
                </TerminalCard>

                <ActionButtons
                    primaryLabel="Return to Terminal"
                    primaryHref="https://greenhacker.in"
                />

            </GridBackground>
        </EmailLayout>
    );
}
