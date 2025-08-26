// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTt-DKiiAez-Noy06CWOfQuYmp8xSb0-4",
  authDomain: "todo-push-app.firebaseapp.com",
  projectId: "todo-push-app",
  storageBucket: "todo-push-app.firebasestorage.app",
  messagingSenderId: "128776070474",
  appId: "1:128776070474:web:93042a07808d5466e8cdb3",
  measurementId: "G-RH2P41MBMC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

// Запрос разрешения на отправку уведомлений
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Ошибка при запросе разрешения на уведомления:', error);
    return false;
  }
};

// Получение FCM токена
export const getFCMToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BCY0XTXvKfeC8kVLwiGS98wmeOs4rALrB9b2hejXK-sgxaIokaVux5c5uuOG-kSGr_xu28Yep9IzHk47oVhhvms" // Замените на ваш публичный VAPID ключ из Firebase
    });

    if (token) {
      console.log("FCM Token:", token);
      localStorage.setItem('fcm_token', token);
      return token;
    } else {
      console.log('Не удалось получить токен');
      return null;
    }
  } catch (error) {
    console.error('Ошибка при получении токена:', error);
    return null;
  }
};

// Обработчик входящих сообщений (когда приложение открыто)
export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

export { messaging };
