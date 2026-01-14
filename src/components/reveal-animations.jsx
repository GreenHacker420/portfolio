"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export const BlurIn = ({
    children,
    className,
    variant,
    delay = 0,
    duration = 1,
}) => {
    const defaultVariants = {
        hidden: { filter: "blur(10px)", opacity: 0 },
        visible: { filter: "blur(0px)", opacity: 1 },
    };
    const combinedVariants = variant || defaultVariants;

    return (
        <motion.h1
            initial="hidden"
            animate="visible"
            transition={{ duration, delay }}
            variants={combinedVariants}
            className={cn(className)}
        >
            {children}
        </motion.h1>
    );
};

export const BoxReveal = ({
    children,
    width = "fit-content",
    boxColor,
    duration,
    delay,
    once = true,
}) => {
    const mainControls = useAnimation();
    const slideControls = useAnimation();

    const ref = useRef(null);
    const isInView = useInView(ref, { once });

    useEffect(() => {
        if (isInView) {
            slideControls.start("visible");
            mainControls.start("visible");
        } else {
            slideControls.start("hidden");
            mainControls.start("hidden");
        }
    }, [isInView, mainControls, slideControls]);

    return (
        <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 75 },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: duration ? duration : 0.5, delay }}
            >
                {children}
            </motion.div>

            <motion.div
                variants={{
                    hidden: { left: 0 },
                    visible: { left: "100%" },
                }}
                initial="hidden"
                animate={slideControls}
                transition={{
                    duration: duration ? duration : 0.5,
                    ease: "easeIn",
                    delay,
                }}
                style={{
                    position: "absolute",
                    top: 4,
                    bottom: 4,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    background: boxColor ? boxColor : "#ffffff00",
                }}
            />
        </div>
    );
};
