import { API_CONFIG, API_ENDPOINTS, fetchWithAuth, getAuthToken } from './apiConfig';
import { getFCMToken, requestNotificationPermission } from './firebaseConfig';

// Сервис для работы с push-уведомлениями

export const registerPushNotifications = async (): Promise<boolean> => {
  try {
    // Запрашиваем разрешение на отправку уведомлений
    const permissionGranted = await requestNotificationPermission();

    if (!permissionGranted) {
      console.log('Разрешение на отправку уведомлений не получено');
      return false;
    }

    // Получаем токен устройства
    const token = await getFCMToken();

    if (!token) {
      console.error('Не удалось получить FCM токен');
      return false;
    }

    // Отправляем токен на сервер для сохранения
    await saveFCMToken(token);

    // Отправляем запрос на бэкенд для обновления настроек push-уведомлений
    await updatePushNotificationSettings(true);

    return true;
  } catch (error) {
    console.error('Ошибка при регистрации push-уведомлений:', error);
    return false;
  }
};

// Сохранение токена на сервере
export const saveFCMToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetchWithAuth(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.NOTIFICATIONS}/register-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    // Альтернативный вариант, соответствующий примеру из запроса
    // await fetch("/api/device-tokens", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(token)
    // });

    if (!response.ok) {
      throw new Error('Не удалось сохранить токен на сервере');
    }

    return true;
  } catch (error) {
    console.error('Ошибка при сохранении токена:', error);
    return false;
  }
};

/**
 * Обновить настройки push уведомлений пользователя
 * @param enabled - статус включения/отключения push-уведомлений
 * @returns Promise<boolean> - успешность операции
 */
export const updatePushNotificationSettings = async (enabled: boolean): Promise<boolean> => {
  try {
    const token = getAuthToken();

    // Отправляем запрос на бэкенд для обновления настроек push-уведомлений
    const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/push?s=${enabled}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка при обновлении настроек push-уведомлений: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Ошибка при обновлении настроек push-уведомлений:', error);
    return false;
  }
};

// Отмена подписки на уведомления
export const unregisterPushNotifications = async (token?: string): Promise<boolean> => {
  try {
    if (!token) {
      // Если токен не передан, пытаемся получить его
      token = localStorage.getItem('fcm_token') || undefined;
    }

    if (!token) {
      console.error('Нет токена для отмены подписки');
      return false;
    }

    const response = await fetchWithAuth(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.NOTIFICATIONS}/unregister-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Не удалось отменить подписку на уведомления');
    }

    // Отправляем запрос на бэкенд для обновления настроек push-уведомлений
    await updatePushNotificationSettings(false);

    // Удаляем токен из localStorage
    localStorage.removeItem('fcm_token');

    return true;
  } catch (error) {
    console.error('Ошибка при отмене подписки на уведомления:', error);
    return false;
  }
};

export const registerDeviceOnly = async (): Promise<boolean> => {
  try {
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      console.log('Разрешение на отправку уведомлений не получено');
      return false;
    }
    const token = await getFCMToken();
    if (!token) {
      console.error('Не удалось получить FCM токен');
      return false;
    }
    await saveFCMToken(token);
    return true;
  } catch (e) {
    console.error('Ошибка при регистрации устройства (без обновления настроек):', e);
    return false;
  }
};
