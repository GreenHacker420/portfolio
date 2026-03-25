"use client";
import React, { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";

export const AnimatedNumber = ({ value, duration = 1.5 }) => {
    const [display, setDisplay] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView || !value) return;
        const target = typeof value === 'number' ? value : parseInt(value) || 0;
        if (target === 0) return;

        const startTime = Date.now();
        const dur = duration * 1000;
        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / dur, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [isInView, value, duration]);

    return <span ref={ref}>{display.toLocaleString()}</span>;
};
