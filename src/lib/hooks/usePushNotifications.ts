// usePushNotifications — đăng ký Service Worker + xin quyền + subscribe Web Push
"use client";

import { useCallback, useEffect, useState } from "react";
import { pushApi } from "@/lib/api/notifications";
import toast from "react-hot-toast";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supported = typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
    setIsSupported(supported);
    if (!supported) return;

    navigator.serviceWorker.register("/sw.js").then(async (registration) => {
      const existing = await registration.pushManager.getSubscription();
      setIsSubscribed(!!existing);
    });
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      toast.error("Trình duyệt này không hỗ trợ thông báo đẩy");
      return;
    }
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Bạn đã từ chối quyền thông báo");
        return;
      }

      const { publicKey } = await pushApi.getVapidPublicKey();
      if (!publicKey) {
        toast.error("Server chưa cấu hình push notification");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await pushApi.subscribe(subscription.toJSON() as PushSubscriptionJSON);
      setIsSubscribed(true);
      toast.success("Đã bật thông báo đẩy!");
    } catch (err) {
      toast.error("Không thể bật thông báo đẩy, thử lại nhé");
    } finally {
      setLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await pushApi.unsubscribe(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setIsSubscribed(false);
      toast.success("Đã tắt thông báo đẩy");
    } finally {
      setLoading(false);
    }
  }, []);

  return { isSupported, isSubscribed, loading, subscribe, unsubscribe };
}
