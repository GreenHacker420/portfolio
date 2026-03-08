import * as React from "react";
import { Section, Link } from "@react-email/components";

export const ActionButtons = ({ primaryLabel, primaryHref, secondaryLabel, secondaryHref }) => {
    return (
        <Section className="mt-10 mb-2 relative z-10">
            <div style={{ textAlign: "center", width: "100%" }}>
                <Link
                    href={primaryHref}
                    className="inline-block px-8 py-3 bg-brand/10 border border-brand/40 rounded-lg text-brand text-xs font-mono uppercase tracking-widest no-underline hover:bg-brand/20 shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all mx-2"
                >
                    {primaryLabel}
                </Link>
                {secondaryHref && (
                    <Link
                        href={secondaryHref}
                        className="inline-block px-8 py-3 bg-transparent border border-white/10 rounded-lg text-zinc-300 text-xs font-mono uppercase tracking-widest no-underline hover:bg-white/5 transition-all mx-2"
                    >
                        {secondaryLabel}
                    </Link>
                )}
            </div>
        </Section>
    );
};
