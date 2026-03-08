import * as React from "react";
import { Section } from "@react-email/components";

export const SignalBadge = ({ text = "System Protocol Active", children }) => (
    <Section className="mb-10 text-center">
        <div className="inline-block px-3 py-1 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/5">
            <span className="inline-block align-middle w-1.5 h-1.5 rounded-full bg-[#22c55e] mr-2"></span>
            <span className="inline-block align-middle text-[#22c55e] text-[10px] font-mono tracking-widest uppercase font-bold">
                {children || text}
            </span>
        </div>
    </Section>
);
