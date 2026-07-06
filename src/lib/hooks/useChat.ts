// useChat — quản lý session + gửi tin nhắn AI Chat
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/lib/api/chat";
import type { ChatTopic, LanguageCode, ChatMessage } from "@/types";
import toast from "react-hot-toast";

export function useChat() {
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);

  const sessionsQuery = useQuery({
    queryKey: ["chat-sessions"],
    queryFn: chatApi.listSessions,
  });

  const createSessionMutation = useMutation({
    mutationFn: (data: { language: LanguageCode; topic: ChatTopic }) => chatApi.createSession(data),
    onSuccess: (session) => {
      setSessionId(session.id);
      setMessages([]);
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
    onError: () => toast.error("Không thể tạo cuộc hội thoại mới"),
  });

  const loadMessagesMutation = useMutation({
    mutationFn: (id: string) => chatApi.getMessages(id),
    onSuccess: (data) => setMessages(data),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      if (!sessionId) throw new Error("Chưa có session");
      // Optimistic update — hiện tin nhắn user ngay lập tức
      setMessages((prev) => [...prev, { id: `temp-${Date.now()}`, role: "user", content }]);
      return chatApi.sendMessage(sessionId, content);
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data.message]);
      if (data.usage) setUsage(data.usage);
    },
    onError: (error: any) => {
      if (error?.response?.status === 429) {
        toast.error("Bạn đã dùng hết lượt chat miễn phí hôm nay. Nâng cấp Premium để chat không giới hạn!");
      } else {
        toast.error("Có lỗi xảy ra, thử lại nhé");
      }
    },
  });

  const openSession = (id: string) => {
    setSessionId(id);
    loadMessagesMutation.mutate(id);
  };

  return {
    sessions: sessionsQuery.data ?? [],
    isLoadingSessions: sessionsQuery.isLoading,
    sessionId,
    messages,
    usage,
    createSession: createSessionMutation.mutate,
    isCreatingSession: createSessionMutation.isPending,
    openSession,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
  };
}
