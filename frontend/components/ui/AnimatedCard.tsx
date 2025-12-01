"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type AnimatedCardProps = {
  children: ReactNode;
  /** Extra Tailwind classes for layout / styling */
  className?: string;
  /** Index used for staggered enter animations */
  index?: number;
};

const baseTransition = {
  duration: 0.22,
  ease: "easeOut" as const,
};

/**
 * AnimatedCard
 * Reusable framer-motion wrapper for list/detail cards so that
 * all workout-related cards share the same animation behavior.
 */
export function AnimatedCard({
  children,
  className = "",
  index = 0,
}: AnimatedCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ ...baseTransition, delay: index * 0.03 }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={className}
    >
      {children}
    </motion.article>
  );
}
