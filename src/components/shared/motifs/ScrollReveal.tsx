// Fade + slide-up khi section vào viewport khi scroll — dùng bọc quanh mỗi section
// trên các trang marketing để trang "sống" hơn khi cuộn. Luôn slide theo 1 hướng duy
// nhất (lên) theo đúng khuyến nghị animation của skill, và tôn trọng prefers-reduced-motion.
"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
