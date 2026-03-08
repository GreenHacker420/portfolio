import * as React from "react";
import { Heading, Text } from "@react-email/components";

export const SystemHeader = ({ title = "GreenHacker", highlight = "", date, children }) => {
    const isGreenHacker = title === "GreenHacker" && !highlight;

    return (
        <React.Fragment>
            {children}
            {isGreenHacker ? (
                <Heading className="text-white text-[32px] font-bold mb-0 tracking-tight leading-tight relative z-10">
                    Green<span className="text-[#22c55e]">Hacker</span>
                </Heading>
            ) : (
                <Heading className="text-white text-[32px] font-bold mb-0 tracking-tight leading-tight relative z-10">
                    {title}{highlight && <span className="text-[#22c55e]"> {highlight}</span>}
                </Heading>
            )}
            {date && (
                <Text className="text-zinc-500 text-[11px] uppercase tracking-[0.4em] mt-2 mb-10 font-mono relative z-10">
                    {date}
                </Text>
            )}
        </React.Fragment>
    );
};

