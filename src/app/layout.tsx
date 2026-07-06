import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

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
        {/* Google Analytics 4 — chỉ tải khi có NEXT_PUBLIC_GA_ID, không set thì bỏ qua hoàn toàn */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}

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
