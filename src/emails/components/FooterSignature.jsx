import * as React from "react";
import { Section, Text, Link } from "@react-email/components";

export const FooterSignature = () => {
    const signatureId = `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return (
        <Section className="bg-surface border-x border-b border-border rounded-b-lg text-center">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border-light to-transparent" />
            <div className="px-8 py-5">
                {/* Social links */}
                <div className="mb-3">
                    <Link href="https://github.com/GreenHacker420" className="text-zinc-600 text-[12px] no-underline mx-2 hover:text-brand">GitHub</Link>
                    <span className="text-zinc-800">·</span>
                    <Link href="https://linkedin.com/in/harshhirawat" className="text-zinc-600 text-[12px] no-underline mx-2 hover:text-brand">LinkedIn</Link>
                    <span className="text-zinc-800">·</span>
                    <Link href="https://greenhacker.in" className="text-zinc-600 text-[12px] no-underline mx-2 hover:text-brand">Portfolio</Link>
                </div>
                <Text className="text-zinc-700 text-[10px] m-0 font-mono">
                    {signatureId} // END_OF_LINE
                </Text>
            </div>
        </Section>
    );
};
