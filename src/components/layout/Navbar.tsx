// Navbar dùng chung cho các trang marketing (home, /marketing/english, /chinese, /japanese, /blog)
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

export default function Navbar() {
  return (
    <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href={ROUTES.HOME} className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-base">🌐</span>
          </div>
          <span className="font-bold text-slate-900 text-sm sm:text-base truncate">AI Language</span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link href={ROUTES.LOGIN} className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 font-medium px-2.5 sm:px-4 py-2 whitespace-nowrap">
            Đăng nhập
          </Link>
          <Link href={ROUTES.REGISTER} className="text-xs sm:text-sm bg-brand text-white font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap">
            Bắt đầu miễn phí
          </Link>
        </div>
      </div>
    </nav>
  );
}
