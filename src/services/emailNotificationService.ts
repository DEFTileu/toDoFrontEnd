import {API_CONFIG, getAuthToken} from './apiConfig';

/**
 * Обновить настройки email уведомлений пользователя
 * @param enabled - статус включения/отключения email-уведомлений
 * @returns Promise<boolean> - успешность операции
 */
export const updateEmailNotificationSettings = async (enabled: boolean): Promise<boolean> => {
  try {
    const token = getAuthToken();// Получаем токен аутентификации

    // Отправляем запрос на бэкенд для обновления настроек email-уведомлений
    const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/email?s=${enabled}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка при обновлении настроек email-уведомлений: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Ошибка при обновлении настроек email-уведомлений:', error);
    return false;
  }
};
