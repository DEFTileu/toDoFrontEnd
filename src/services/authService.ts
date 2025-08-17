import { User } from '../types';
import { fetchWithAuth, fetchWithTimeout, tokenStorage, API_ENDPOINTS, ERROR_MESSAGES, API_CONFIG } from './apiConfig';
/**
 * AuthService - профессиональный сервис аутентификации
 * Работает только с реальным API
 */
class AuthService {
  /**
   * Вход в систему
   */
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await fetchWithTimeout(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.LOGIN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      if (!data.success || !data.accessToken || !data.user) {
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
      }

      // Сохраняем токены в правильном формате
      tokenStorage.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      });

      // Сохраняем данные пользователя
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      // Возвращаем весь ответ, так как он может понадобиться в компоненте
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  /**
   * Регистрация пользователя
   */
  async register(name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> {
    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.REGISTER}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || ERROR_MESSAGES.REGISTRATION_FAILED);
    }

    return { success: true, message: data.message };
  }

  /**
   * Получение данных текущего пользователя
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetchWithAuth(API_CONFIG.BASE_URL + API_ENDPOINTS.ME, {
        method: 'GET'
      });


      if (!response.ok) {
        this.logout();
        return null;
      }

      const user = await response.json();
      localStorage.setItem('auth_user', JSON.stringify(user));
      return user;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  /**
   * Подтверждение email
   */
  async verifyEmail(email: string, code: string): Promise<User> {
    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.VERIFY_EMAIL}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Ошибка подтверждения email');
    }
    return data.user;
  }

  /**
   * Повторная отправка кода подтверждения
   */
  async resendVerification(email: string): Promise<void> {
    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RESEND_VERIFICATION}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || 'Ошибка отправки кода подтверждения');
    }
  }

  /**
   * Выход из системы
   */
  async logout(): Promise<void> {
    try {
      await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.LOGOUT}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      tokenStorage.clearTokens();
      localStorage.removeItem('auth_user');
    }
  }

  /**
   * Обновление профиля пользователя
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await fetchWithAuth(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPDATE_PROFILE}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData?.message || ERROR_MESSAGES.SERVER_ERROR);
    }

    // Обновляем данные в localStorage
    localStorage.setItem('auth_user', JSON.stringify(responseData));

    return responseData;
  }

  /**
   * Загрузка аватара
   */
  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetchWithAuth(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPLOAD_AVATAR}`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Ошибка загрузки аватара');
    }

    // Обновляем данные в localStorage
    localStorage.setItem('auth_user', JSON.stringify(data));

    return data;
  }

  /**
   * Смена пароля
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetchWithAuth(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CHANGE_PASSWORD}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
        headers: { 'Content-Type': 'application/json' },
      }

    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Ошибка смены пароля');
    }
  }

  /**
   * Получение пользователя из localStorage
   */
  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('auth_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Проверка аутентификации
   */
  isAuthenticated(): boolean {
    const tokens = tokenStorage.getTokens();
    return tokens !== null && !tokenStorage.isTokenExpired();
  }
}

// ��кспортируем единственный экземпляр сервиса
export const authService = new AuthService();
