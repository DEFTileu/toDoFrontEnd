import { fetchWithAuth, API_ENDPOINTS, API_CONFIG } from './apiConfig';


export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string; // изменил с body на message
  status: string; // "READ" | "SENT" | другие статусы
  createdAt: string;
  readAt?: string | null; // Оставляем для совместимости, но основной индикатор - status
  payload?: any;
}

export interface NotificationResponse {
  content: Notification[]; // изменил с notifications на content
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
  unreadCount: number; // Добавляем поле unreadCount из ответа бэкенда
}

export interface NotificationParams {
  page?: number;
  size?: number;
}

export const fetchNotifications = async (params: NotificationParams = {}): Promise<NotificationResponse> => {
  const { page = 0, size = 10 } = params;
  const url = new URL(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.NOTIFICATIONS}`);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('size', size.toString());

  const response = await fetchWithAuth(url.toString(), {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Ошибка получения уведомлений');
  return await response.json();
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  console.log('API: Отправляем запрос на отметку уведомления как прочитанного, ID:', notificationId);
  const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`;
  console.log('API: URL запроса:', url);

  const response = await fetchWithAuth(url, {
    method: 'POST',
  });

  console.log('API: Ответ сервера:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API: Ошибка ответа:', errorText);
    throw new Error(`Ошибка при отметке уведомления как прочитанного: ${response.status} ${errorText}`);
  }

  console.log('API: Уведомление успешно отмечено как прочитанное');
};
