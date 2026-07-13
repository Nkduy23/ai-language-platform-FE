// Service Worker — nhận Web Push event và hiển thị notification hệ điều hành
// File này PHẢI nằm ở root /public (không phải /public/js/...) để có scope toàn site

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Thông báo mới", body: event.data.text() };
  }

  const options = {
    body: payload.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: { link: payload.link || "/" },
  };

  event.waitUntil(self.registration.showNotification(payload.title || "AI Language Platform", options));
});

// Khi user bấm vào notification — mở đúng trang liên quan
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification.data?.link || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(link) && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(link);
    }),
  );
});
