// Thanh CTA dính đáy màn hình trên mobile — chỉ hiện sau khi cuộn qua khỏi hero,
// giúp tăng tỉ lệ chuyển đổi vì người dùng không cần cuộn ngược lên đầu trang.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-postcard border-t-[1.5px] border-paper-line px-4 py-3 shadow-stamp"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <Link
            href="/auth/register"
            className="flex items-center justify-center gap-2 w-full bg-airmail text-postcard font-semibold py-3 rounded-md shadow-stamp-sm active:translate-x-px active:translate-y-px active:shadow-none"
          >
            Bắt đầu miễn phí
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
