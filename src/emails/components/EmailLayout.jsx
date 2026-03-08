import * as React from "react";
import { Html, Head, Body, Tailwind, Preview } from "@react-email/components";
import { tailwindConfig } from "./theme";

export const EmailLayout = ({ previewText, children }) => {
    return (
        <Html>
            <Tailwind config={tailwindConfig}>
                <Head>
                    <style>{`
                        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600&display=swap');
                        .grid-bg {
                            background-size: 30px 30px;
                            background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                        }
                    `}</style>
                </Head>
                {previewText && <Preview>{previewText}</Preview>}
                <Body className="bg-background my-auto mx-auto font-sans text-white">
                    {children}
                </Body>
            </Tailwind>
        </Html>
    );
};
