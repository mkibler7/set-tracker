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
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");

  // Reduce travel on phone to avoid “floaty” feel + text shimmer
  const travel = isPhone ? 8 : 16;

  const yIn = direction === 1 ? travel : -travel;
  const yOut = direction === 1 ? -travel : travel;

  // Reverse stagger on backward pagination; remove stagger on phones
  const delayIndex = direction === 1 ? index : Math.max(0, total - 1 - index);
  const delay = isPhone ? 0 : delayIndex * 0.03;

  // Turn off layout animation on phones (common jank source)
  const layoutProp = isPhone ? undefined : true;

  // Disable hover effects on touch devices
  const hoverProps = isCoarsePointer
    ? {}
    : { whileHover: { y: -3, scale: 1.01 }, whileTap: { scale: 0.99 } };

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
      transition={{ ...baseTransition, delay: isPhone ? 0 : index * 0.03 }}
      style={{ willChange: "transform" }}
      className={className}
      {...hoverProps}
    >
      {children}
    </motion.article>
  );
}
