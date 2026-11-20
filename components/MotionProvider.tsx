"use client";
import { MotionConfig } from "framer-motion";

/** reducedMotion="user" makes every Framer Motion animation respect prefers-reduced-motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
