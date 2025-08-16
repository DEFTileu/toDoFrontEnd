// API Configuration for Spring Boot Backend
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://task-flow-spring-boot-a7b12abc3f71.herokuapp.com/api',
  TIMEOUT: 10000,
  REQUEST_TIMEOUT: 15000,
};

// API endpoints following Spring Boot REST conventions
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  REFRESH_TOKEN: '/auth/refresh',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
  
  // User management
  UPDATE_PROFILE: '/users/profile',
  UPLOAD_AVATAR: '/users/avatar',
  CHANGE_PASSWORD: '/users/password',
  
  // Tasks
  TASKS: '/tasks',
  TASK_BY_ID: (id: string) => `/tasks/${id}`,
  TASK_COMMENTS: (id: string) => `/tasks/${id}/comments`,
  TASK_STATUS: (id: string) => `/tasks/${id}/status`,
  
  // Sprints
  SPRINTS: '/sprints',
  SPRINT_BY_ID: (id: string) => `/sprints/${id}`,
  SPRINT_TASKS: (id: string) => `/sprints/${id}/tasks`,
  ACTIVE_SPRINT: '/sprints/active',
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Неверный email или пароль',
  SESSION_EXPIRED: 'Сессия истекла, пожалуйста, войдите снова',
  NETWORK_ERROR: 'Ошибка сети, проверьте подключение к интернету',
  SERVER_ERROR: 'Ошибка сервера, попробуйте позже',
  TIMEOUT: 'Превышено время ожидания ответа от сервера',
  UNAUTHORIZED: 'Необходима авторизация',
  FORBIDDEN: 'Доступ запрещен',
  REGISTRATION_FAILED: 'Регистрация не удалась, попробуйте позже'
} as const;

// Request configuration
export const createRequestConfig = (token?: string): RequestInit => ({
  headers: {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// Fetch with timeout wrapper
export const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const timeout = API_CONFIG.TIMEOUT;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(ERROR_MESSAGES.TIMEOUT);
      }
    }
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }
};

// Определение типа для tokenStorage
interface TokenStorage {
  getTokens: () => { accessToken: string; refreshToken: string } | null;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  clearTokens: () => void;
  isTokenExpired: () => boolean;
  getAuthToken: () => string | null;
  getRefreshToken: () => string | null;
}

// Token storage implementation
export const tokenStorage: TokenStorage = {
  getTokens: () => {
    try {
      const tokens = localStorage.getItem('auth_tokens');
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  },

  setTokens: (tokens: { accessToken: string; refreshToken: string }) => {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  },

  clearTokens: () => {
    localStorage.removeItem('auth_tokens');
  },

  isTokenExpired: (): boolean => {
    const token = tokenStorage.getAuthToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expTime = payload.exp * 1000; // конвертируем в миллисекунды
      return Date.now() >= expTime;
    } catch {
      return true;
    }
  },

  getAuthToken: () => {
    const tokens = tokenStorage.getTokens();
    return tokens?.accessToken || null;
  },

  getRefreshToken: () => {
    const tokens = tokenStorage.getTokens();
    return tokens?.refreshToken || null;
  }
};

// Fetch with authentication
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = tokenStorage.getAuthToken();

  if (!token) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }

  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  };

  try {
    const response = await fetchWithTimeout(url, authOptions);

    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      // Токен истек, пытаемся обновить
      const refreshed = await refreshToken();
      if (refreshed) {
        // Повторяем запрос с новым токеном
        authOptions.headers['Authorization'] = `Bearer ${tokenStorage.getAuthToken()}`;
        return fetchWithTimeout(url, authOptions);
      } else {
        throw new Error(ERROR_MESSAGES.SESSION_EXPIRED);
      }
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }
};

// Token refresh function
export async function refreshToken(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      tokenStorage.clearTokens();
      return false;
    }

    const data = await response.json();

    const tokens = { accessToken: data.accessToken, refreshToken: data.refreshToken };
    tokenStorage.setTokens(tokens);
    return true;
  } catch {
    tokenStorage.clearTokens();
    return false;
  }
}

// Helper function to get auth token
export const getAuthToken = () => tokenStorage.getAuthToken();
