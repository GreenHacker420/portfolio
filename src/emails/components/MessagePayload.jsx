import * as React from "react";
import { Text } from "@react-email/components";
import { TerminalCard } from "./TerminalCard";

export const MessagePayload = ({ title = "MESSAGE PAYLOAD", message }) => {
    return (
        <>
            {title && (
                <span className="text-[11px] font-bold text-zinc-500 tracking-[0.2em] font-mono uppercase mb-4 block">
                    {title}
                </span>
            )}
            <TerminalCard className="mb-0">
                <Text className="text-[15px] text-zinc-200 leading-[1.7] font-mono m-0 whitespace-pre-wrap">
                    {message}
                </Text>
            </TerminalCard>
        </>
    );
};
