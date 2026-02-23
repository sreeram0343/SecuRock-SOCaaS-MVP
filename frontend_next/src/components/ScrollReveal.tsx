import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

interface ScrollRevealProps {
    children: React.ReactNode;
    variant?: "fadeUp" | "fadeInLeft" | "fadeInRight" | "scaleUp";
    delay?: number;
    className?: string;
    viewportAmount?: number;
}

export default function ScrollReveal({
    children,
    variant = "fadeUp",
    delay = 0,
    className = "",
    viewportAmount = 0.2
}: ScrollRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: viewportAmount });

    const variants: Record<string, Variants> = {
        fadeUp: {
            hidden: { opacity: 0, y: 40 },
            visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut", delay }
            }
        },
        fadeInLeft: {
            hidden: { opacity: 0, x: -60 },
            visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }
            }
        },
        fadeInRight: {
            hidden: { opacity: 0, x: 60 },
            visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }
            }
        },
        scaleUp: {
            hidden: { opacity: 0, scale: 0.85 },
            visible: {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay } // Bounce
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants[variant]}
            className={className}
        >
            {children}
        </motion.div>
    );
}
