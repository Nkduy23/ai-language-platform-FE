// AI Chat page — chọn ngôn ngữ/chủ đề, chat với AI, xem grammar feedback
"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ChatWindow from "@/components/chat/ChatWindow";
import GrammarSidebar from "@/components/chat/GrammarSidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useChat } from "@/lib/hooks/useChat";
import { LANGUAGES, CHAT_TOPICS } from "@/lib/constants/app";
import type { LanguageCode, ChatTopic, ChatMessage } from "@/types";

export default function ChatPage() {
  const { sessionId, messages, usage, createSession, isCreatingSession, sendMessage, isSending } = useChat();

  const [language, setLanguage] = useState<LanguageCode>("EN");
  const [topic, setTopic] = useState<ChatTopic>("DAILY");
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);

  if (!sessionId) {
    return (
      <DashboardLayout title="AI Chat" description="Hội thoại với AI như người bản ngữ">
        <Card className="max-w-lg mx-auto space-y-5">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Chọn ngôn ngữ</p>
            <div className="flex gap-2">
              {Object.entries(LANGUAGES).map(([code, info]) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code as LanguageCode)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm ${language === code ? "border-brand bg-brand/5 text-brand" : "border-surface-border text-slate-600"}`}
                >
                  {info.flag} {info.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Chọn chủ đề</p>
            <div className="grid grid-cols-2 gap-2">
              {CHAT_TOPICS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTopic(t.value as ChatTopic)}
                  className={`rounded-lg border px-3 py-2 text-sm text-left ${topic === t.value ? "border-brand bg-brand/5 text-brand" : "border-surface-border text-slate-600"}`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          <Button fullWidth loading={isCreatingSession} onClick={() => createSession({ language, topic })}>
            Bắt đầu trò chuyện
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="AI Chat" description="Hội thoại với AI như người bản ngữ">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 h-[calc(100vh-220px)]">
        <ChatWindow messages={messages} onSend={(content) => sendMessage(content)} onSelectMessage={setSelectedMessage} selectedMessageId={selectedMessage?.id} isSending={isSending} usage={usage} />
        <GrammarSidebar message={selectedMessage} />
      </div>
    </DashboardLayout>
  );
}
