"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  index?: number;

  /** +1 = forward pagination, -1 = backward pagination */
  direction?: 1 | -1;

  /** Number of cards in current rendered list (for reverse stagger) */
  total?: number;
};

const baseTransition = {
  duration: 0.22,
  ease: "easeOut" as const,
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    onChange(); // set initial
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [query]);

  return matches;
}

export function AnimatedCard({
  children,
  className = "",
  index = 0,
  direction = 1,
  total = 1,
}: AnimatedCardProps) {
  const reduceMotion = useReducedMotion();

  // "Phones" heuristic: Tailwind sm breakpoint is 640px
  const isPhone = useMediaQuery("(max-width: 639px)");

  // Prefer hover capability over coarse pointer detection
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");

  // Reduce travel on phone to avoid “floaty” feel + text shimmer
  const travel = isPhone ? 8 : 16;

  // Reverse stagger on backward pagination; remove stagger on phones
  const delayIndex = direction === 1 ? index : Math.max(0, total - 1 - index);
  const delay = isPhone ? 0 : delayIndex * 0.03;

  // Turn off layout animation on phones (common jank source)
  const layoutProp = isPhone ? undefined : true;

  // Disable hover effects on touch devices
  const hoverProps = !canHover
    ? {}
    : {
        whileHover: { y: -3, boxShadow: "0 12px 24px rgba(0,0,0,0.35)" },
        whileTap: { y: 0 },
      };

  if (reduceMotion) {
    // Accessibility / user preference: no motion
    return <motion.article className={className}>{children}</motion.article>;
  }

  return (
    <motion.article
      layout={layoutProp as any}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ ...baseTransition, delay }}
      style={{ willChange: "transform" }}
      className={className}
      {...hoverProps}
    >
      {children}
    </motion.article>
  );
}
