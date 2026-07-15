// Lớp texture chấm ở hero di chuyển chậm hơn nội dung khi cuộn — parallax nhẹ,
// gợi cảm giác "bản đồ thế giới" ở xa. Client-only vì cần theo dõi vị trí cuộn.
"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function HeroParallaxBg() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 60]); // nền trôi chậm hơn nội dung
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-0 opacity-[0.08] pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(#F5EFE0 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        y: reduceMotion ? 0 : y,
      }}
    />
  );
}
