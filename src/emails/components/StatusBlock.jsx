import * as React from "react";
import { Text } from "@react-email/components";

export const StatusBlock = ({ label = "ETA:", value }) => {
    return (
        <Text className="text-zinc-500 text-xs font-mono bg-black/40 p-3 rounded-md border border-white/5 mt-6 mb-0">
            <span className="text-brand-dim">{label}</span> {value}
        </Text>
    );
};
