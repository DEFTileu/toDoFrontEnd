/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Инициализация приложения Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDTt-DKiiAez-Noy06CWOfQuYmp8xSb0-4",
  authDomain: "todo-push-app.firebaseapp.com",
  projectId: "todo-push-app",
  storageBucket: "todo-push-app.firebasestorage.app",
  messagingSenderId: "128776070474",
  appId: "1:128776070474:web:93042a07808d5466e8cdb3",
  measurementId: "G-RH2P41MBMC"
});

const messaging = firebase.messaging();

// Обработчик фоновых сообщений
messaging.onBackgroundMessage(function(payload) {
  console.log('Получено фоновое сообщение:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Обработчик нажатия на уведомление
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientsList => {
      for (const client of clientsList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
