import * as React from "react";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TextArea = React.forwardRef(({ className, ...props }, ref) => {
    const radius = 100;
    const [visible, setVisible] = React.useState(false);

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            style={{
                background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
          var(--blue-500),
          transparent 80%
        )
      `,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            className="p-[2px] rounded-lg transition duration-300 group/input"
        >
            <textarea
                className={cn(
                    `flex min-h-[80px] w-full border-none bg-zinc-800 text-white shadow-input rounded-md px-3 py-2 text-sm  placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green disabled:cursor-not-allowed disabled:opacity-50
           group-hover/input:shadow-none transition duration-400`,
                    className
                )}
                ref={ref}
                {...props}
            />
        </motion.div>
    );
});
TextArea.displayName = "TextArea";

export { TextArea };
