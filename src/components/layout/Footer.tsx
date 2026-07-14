// Footer dùng chung cho các trang marketing
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

const LINKS = [
  { href: ROUTES.LEARN_ENGLISH, label: "Học tiếng Anh" },
  { href: ROUTES.LEARN_CHINESE, label: "Học tiếng Trung" },
  { href: ROUTES.LEARN_JAPANESE, label: "Học tiếng Nhật" },
  { href: ROUTES.BLOG, label: "Blog" },
];

export default function Footer() {
  return (
    <footer className="border-t-[1.5px] border-paper-line py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-4 text-center">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-xs sm:text-sm text-slate-500 hover:text-brand">
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-xs sm:text-sm text-slate-400">© {new Date().getFullYear()} AI Language Platform · Học tiếng Anh, Trung, Nhật cùng AI</p>
      </div>
    </footer>
  );
}
