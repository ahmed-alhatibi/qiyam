importScripts('https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB2oxQKGYq7HM2TiSCyxejVBctJn9BLtsE",
  authDomain: "qiyam-b55f0.firebaseapp.com",
  projectId: "qiyam-b55f0",
  storageBucket: "qiyam-b55f0.firebasestorage.app",
  messagingSenderId: "467191879712",
  appId: "1:467191879712:web:7bf2185e8f50d34ee38445"
});

const messaging = firebase.messaging();

// رسائل البيانات تحتاج عرضاً يدوياً. رسائل Notifications المرسلة من Firebase Console
// يستطيع FCM عرضها تلقائياً في الخلفية.
messaging.onBackgroundMessage((payload) => {
  if (payload && payload.notification) return;
  const title = (payload && payload.data && payload.data.title) || 'قيام';
  const options = {
    body: (payload && payload.data && payload.data.body) || 'حان وقت القيام',
    icon: './qiyam-icon-512.png',
    badge: './qiyam-icon-512.png',
    tag: 'qiyam-push',
    data: { url: './?ring=1' }
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = './?ring=1';
  event.waitUntil((async()=>{
    const windows = await clients.matchAll({type:'window', includeUncontrolled:true});
    for (const client of windows) {
      if ('focus' in client) {
        try { await client.navigate(target); } catch(e) {}
        return client.focus();
      }
    }
    return clients.openWindow ? clients.openWindow(target) : undefined;
  })());
});
