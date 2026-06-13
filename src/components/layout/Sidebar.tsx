"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Brain, MessageCircle, Mic, Map, User, LogOut, Zap, Flame, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { href: ROUTES.LEARN, label: "Từ vựng", icon: BookOpen },
  { href: ROUTES.GRAMMAR, label: "Ngữ pháp", icon: GraduationCap },
  { href: ROUTES.QUIZ, label: "Quiz", icon: Brain },
  { href: ROUTES.CHAT, label: "AI Chat", icon: MessageCircle },
  { href: ROUTES.SPEAKING, label: "Speaking", icon: Mic },
  { href: ROUTES.ROADMAP, label: "Lộ trình", icon: Map },
  { href: ROUTES.PROFILE, label: "Hồ sơ", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
    router.push(ROUTES.LOGIN);
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <Link href={ROUTES.LEARN} className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-lg">🌐</span>
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm leading-none">AI Language</p>
            <p className="text-xs text-slate-400 mt-0.5">Platform</p>
          </div>
        </Link>
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-3 mx-3 mt-3 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">{user.displayName?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.displayName}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active ? "bg-blue-50 text-brand" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-brand" : "text-slate-400")} />
              {label}
              {href === ROUTES.CHAT && <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">AI</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-1.5 text-orange-500">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-semibold">0 ngày</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-1.5 text-brand">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-semibold">0 XP</span>
          </div>
        </div>

        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors">
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
