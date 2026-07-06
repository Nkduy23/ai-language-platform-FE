// useSpeaking — ghi âm mic (MediaRecorder) + gửi lên BE phân tích
import { useCallback, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { speakingApi } from "@/lib/api/speaking";
import type { LanguageCode, SpeakingResult } from "@/types";
import toast from "react-hot-toast";

export function useSpeaking(language: LanguageCode, prompt?: string) {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<SpeakingResult | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const analyzeMutation = useMutation({
    mutationFn: (audioBlob: Blob) => speakingApi.analyze({ audioBlob, language, prompt }),
    onSuccess: (data) => setResult(data),
    onError: () => toast.error("Không phân tích được audio, thử lại nhé"),
  });

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        analyzeMutation.mutate(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setResult(null);
    } catch (err) {
      toast.error("Không truy cập được microphone. Kiểm tra quyền trình duyệt nhé.");
    }
  }, [analyzeMutation]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    isAnalyzing: analyzeMutation.isPending,
    result,
    reset: () => setResult(null),
  };
}
