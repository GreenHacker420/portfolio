import * as React from "react";
import { Text } from "@react-email/components";
import { TerminalCard } from "./TerminalCard";

export const SenderCard = ({ name, email }) => {
    const initial = name ? name.charAt(0).toUpperCase() : "U";

    return (
        <>
            <span className="text-[11px] font-bold text-zinc-500 tracking-[0.2em] font-mono uppercase mb-4 block group">
                SENDER DETAILS
            </span>
            <TerminalCard className="mb-8 p-0">
                <table className="w-full border-collapse" cellPadding={0} cellSpacing={0}>
                    <tbody>
                        <tr>
                            {/* Aceternity Style Avatar Glow */}
                            <td className="w-14 h-14 pr-5 align-middle pointer-events-none">
                                <div className="p-[2px] rounded-full bg-gradient-to-b from-cyber-green to-transparent w-14 h-14">
                                    <div className="w-full h-full rounded-full bg-[#0a0a0a] border border-zinc-800 flex items-center justify-center text-cyber-green text-xl font-bold font-mono shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                                        {initial}
                                    </div>
                                </div>
                            </td>
                            <td className="align-middle">
                                <Text className="text-xl font-extrabold text-[#e5e5e5] tracking-tight m-0 mb-1">{name}</Text>
                                <Text className="text-[14px] text-zinc-400 font-mono m-0">{email}</Text>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </TerminalCard>
        </>
    );
};
