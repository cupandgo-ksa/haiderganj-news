importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_NEW_API_KEY",
  authDomain: "haiderganj-news.firebaseapp.com",
  projectId: "haiderganj-news",
  storageBucket: "haiderganj-news.firebasestorage.app",
  messagingSenderId: "YOUR_NEW_SENDER_ID",
  appId: "YOUR_NEW_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title =
    payload?.notification?.title ||
    payload?.data?.title ||
    "হায়দারগঞ্জ নিউজ";

  const options = {
    body:
      payload?.notification?.body ||
      payload?.data?.body ||
      "নতুন সংবাদ প্রকাশিত হয়েছে",
    icon: payload?.data?.icon || "./favicon.png",
    badge: payload?.data?.badge || "./favicon.png",
    data: {
      url: payload?.data?.url || "./"
    }
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    event.notification?.data?.url ||
    "./";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
