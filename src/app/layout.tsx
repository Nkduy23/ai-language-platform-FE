import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "AI Language Platform — Học Ngoại Ngữ Cùng AI",
    template: "%s | AI Language Platform",
  },
  description: "Nền tảng học tiếng Anh, tiếng Trung, tiếng Nhật với AI. Luyện hội thoại, từ vựng, ngữ pháp cùng giáo viên AI thông minh.",
  keywords: ["học tiếng Anh", "học tiếng Trung", "học tiếng Nhật", "AI", "flashcard"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "AI Language Platform",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-screen bg-slate-50">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "10px",
                background: "#1e293b",
                color: "#f8fafc",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
