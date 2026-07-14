// Dashed "flight path" line with a small plane that travels down it as the
// user scrolls through the wrapped section — ties Home's feature sections
// together like stops on a journey. Client-only (uses scroll position).
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plane } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FlightPathProps {
  children: React.ReactNode;
  className?: string;
}

export default function FlightPath({ children, className }: FlightPathProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const top = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [90, 90]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* Dashed vertical line, hidden on small screens where sections stack tightly */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 border-l-2 border-dashed border-ink-navy/25" />

      <motion.div
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center text-airmail"
        style={{ top, rotate }}
      >
        <Plane className="w-5 h-5" />
      </motion.div>

      {children}
    </div>
  );
}
