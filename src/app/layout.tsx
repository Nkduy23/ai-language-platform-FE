import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import FloatingActionButtons from "@/components/shared/FloatingActionButtons";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "900"],
  variable: "--font-display",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "700"],
  variable: "--font-mono",
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
    <html lang="vi" className={`${fraunces.variable} ${jakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-postcard font-sans">
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
          <FloatingActionButtons />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "6px",
                background: "#1B2A4C",
                color: "#F5EFE0",
                fontSize: "14px",
                border: "1.5px solid #101B33",
                boxShadow: "3px 3px 0px 0px #101B33",
              },
              success: { iconTheme: { primary: "#2A9D8F", secondary: "#F5EFE0" } },
              error: { iconTheme: { primary: "#E8543F", secondary: "#F5EFE0" } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
