// Cụm nút nổi góc phải màn hình — hiện trên toàn bộ site (marketing + dashboard).
// 3 nút theo đúng đề xuất:
//   1. Chatbox — soạn nhanh 1 tin nhắn, gửi qua email mặc định của máy (mailto:).
//      Đây là bản MVP không cần backend; khi có dịch vụ live-chat thật (Tawk.to,
//      Crisp, Messenger…) chỉ cần thay nội dung panel này bằng script/widget đó.
//   2. Scroll to top — chỉ hiện sau khi cuộn qua 1 đoạn.
//   3. Zalo / Email nhanh — bấm ra 2 đường dẫn liên hệ trực tiếp, không cần gõ gì.
//
// CẦN THAY: số điện thoại Zalo và email hỗ trợ đang là placeholder, xem hằng số
// ZALO_PHONE / SUPPORT_EMAIL bên dưới.
"use client";

import { useEffect, useState } from "react";
import { MessageCircle, ArrowUp, Mail, Send, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const ZALO_PHONE = "0815934934";
const SUPPORT_EMAIL = "flueni238@gmail.com";

export default function FloatingActionButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const sendMessage = () => {
    const body = encodeURIComponent(message || "Xin chào, mình cần hỗ trợ về...");
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Hỗ trợ từ AI Language Platform")}&body=${body}`;
    setChatOpen(false);
    setMessage("");
  };

  const closeAllPanels = () => {
    setChatOpen(false);
    setContactOpen(false);
  };

  return (
    <>
      {/* Overlay để đóng panel khi bấm ra ngoài */}
      {(chatOpen || contactOpen) && <div className="fixed inset-0 z-40" onClick={closeAllPanels} aria-hidden="true" />}

      <div className="fixed bottom-24 sm:bottom-5 right-4 sm:right-6 z-50 flex flex-col items-end gap-3">
        {/* Scroll to top — chỉ hiện khi đã cuộn xuống */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Lên đầu trang"
            title="Lên đầu trang"
            className="w-11 h-11 rounded-full bg-postcard border-[1.5px] border-paper-line text-ink-navy shadow-stamp-sm hover:shadow-stamp hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Zalo / Email nhanh */}
        <div className="relative">
          {contactOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-56 bg-postcard rounded-md border-[1.5px] border-paper-line shadow-stamp p-2 z-50">
              <a href={`https://zalo.me/${ZALO_PHONE}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-postcard-dark transition-colors">
                <span className="w-8 h-8 rounded-full bg-stamp-teal/15 text-stamp-teal flex items-center justify-center font-display font-bold text-xs flex-shrink-0">Z</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-navy">Nhắn Zalo</p>
                  <p className="text-xs text-ink-muted truncate">{ZALO_PHONE}</p>
                </div>
              </a>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-postcard-dark transition-colors">
                <span className="w-8 h-8 rounded-full bg-airmail/15 text-airmail flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-navy">Gửi Email</p>
                  <p className="text-xs text-ink-muted truncate">{SUPPORT_EMAIL}</p>
                </div>
              </a>
            </div>
          )}
          <button
            onClick={() => {
              setContactOpen((v) => !v);
              setChatOpen(false);
            }}
            aria-label="Liên hệ nhanh qua Zalo hoặc Email"
            title="Liên hệ nhanh"
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shadow-stamp transition-all duration-200",
              contactOpen ? "bg-ink-navy text-postcard" : "bg-postcard border-[1.5px] border-gold-foil text-[#8A6425] hover:shadow-stamp-sm hover:-translate-y-0.5",
            )}
          >
            {contactOpen ? <X className="w-5 h-5" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

        {/* Chatbox — soạn nhanh 1 tin nhắn hỗ trợ */}
        <div className="relative">
          {chatOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-72 sm:w-80 bg-postcard rounded-md border-[1.5px] border-paper-line shadow-stamp overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 bg-ink-navy">
                <p className="text-sm font-display font-semibold text-postcard">Cần hỗ trợ?</p>
                <button onClick={() => setChatOpen(false)} className="text-postcard/60 hover:text-postcard">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-ink-muted">Để lại lời nhắn, đội ngũ sẽ phản hồi qua email sớm nhất có thể.</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mình cần hỗ trợ về..."
                  rows={3}
                  className="w-full rounded-md border-[1.5px] border-surface-border bg-postcard px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-airmail"
                />
                <button
                  onClick={sendMessage}
                  className="w-full flex items-center justify-center gap-2 bg-airmail text-postcard font-medium text-sm py-2.5 rounded-md hover:bg-airmail-dark transition-colors shadow-stamp-sm"
                >
                  <Mail className="w-4 h-4" />
                  Gửi qua Email
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              setChatOpen((v) => !v);
              setContactOpen(false);
            }}
            aria-label="Mở hộp chat hỗ trợ"
            title="Chat hỗ trợ"
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center shadow-stamp transition-all duration-200",
              chatOpen ? "bg-ink-navy text-postcard" : "bg-airmail text-postcard hover:bg-airmail-dark hover:-translate-y-0.5",
            )}
          >
            {chatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </>
  );
}
