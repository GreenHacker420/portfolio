import * as React from "react";
import { Container, Section } from "@react-email/components";

export const GridBackground = ({ children, footer }) => {
    return (
        <Container className="my-[40px] mx-auto max-w-[560px] bg-background">
            {/* React Bits inspired: Gradient glowing top bar */}
            <Section className="h-[4px] w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 blur-[1px]" />
            <Section className="h-[1px] w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />

            <Section className="bg-surface border-x border-b border-border p-10 text-center grid-bg shadow-[0_0_40px_rgba(34,197,94,0.05)] relative overflow-hidden">
                {/* React Bits inspired: Soft blur background globe/spotlight */}
                <div className="absolute top-[-50px] left-1/2 ml-[-100px] w-[200px] h-[100px] bg-brand-glow blur-[60px] rounded-full pointer-events-none" />
                {children}
            </Section>

            {footer}
        </Container>
    );
};


