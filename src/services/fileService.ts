import { API_CONFIG, fetchWithAuth, tokenStorage, ERROR_MESSAGES } from './apiConfig';

/**
 * Uploads a file to the server and returns the file URL.
 * @param file The file to upload.
 * @returns The URL of the uploaded file.
 */
export const uploadFile = async (file: File): Promise<string> => {
  // Проверяем авторизацию
  const token = tokenStorage.getAuthToken();
  if (!token) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }

  // Проверяем размер файла (максимум 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('Файл слишком большой. Максимальный размер: 10MB');
  }

  // Проверяем тип файла
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Неподдерживаемый тип файла. Разрешены: JPEG, PNG, GIF, WebP');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetchWithAuth(`${API_CONFIG.BASE_URL}/files/upload`, {
      method: 'POST',
      body: formData,
      // Не устанавливаем Content-Type для FormData - браузер сам установит с boundary
    });

    if (!response.ok) {
      // Пытаемся получить детали ошибки от сервера
      let errorMessage = 'Не удалось загрузить файл';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Если не удалось распарсить JSON, используем стандартное сообщение
        switch (response.status) {
          case 400:
            errorMessage = 'Некорректный файл';
            break;
          case 401:
            errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
            break;
          case 403:
            errorMessage = ERROR_MESSAGES.FORBIDDEN;
            break;
          case 413:
            errorMessage = 'Файл слишком большой';
            break;
          case 415:
            errorMessage = 'Неподдерживаемый тип файла';
            break;
          case 500:
            errorMessage = ERROR_MESSAGES.SERVER_ERROR;
            break;
          default:
            errorMessage = `Ошибка загрузки: ${response.status}`;
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Проверяем, что в ответе есть URL

    if (!data.url) {
      throw new Error('Сервер не вернул URL файла');
    }

    return data.url;
  } catch (error) {
    console.error('File upload failed:', error);

    // Если это наша ошибка с конкретным сообщением, прокидываем её
    if (error instanceof Error) {
      throw error;
    }

    // Если это неизвестная ошибка, используем общее сообщение
    throw new Error('Не удалось загрузить файл. Попробуйте позже.');
  }
};

/**
 * Deletes a file from the server.
 * @param fileUrl The URL of the file to delete.
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  // Извлекаем ID файла из URL
  const fileId = fileUrl.split('/').pop();
  if (!fileId) {
    throw new Error('Некорректный URL файла');
  }

  try {
    const response = await fetchWithAuth(`${API_CONFIG.BASE_URL}/files/${fileId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      let errorMessage = 'Не удалось удалить файл';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        switch (response.status) {
          case 401:
            errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
            break;
          case 403:
            errorMessage = ERROR_MESSAGES.FORBIDDEN;
            break;
          case 404:
            errorMessage = 'Файл не найден';
            break;
          case 500:
            errorMessage = ERROR_MESSAGES.SERVER_ERROR;
            break;
          default:
            errorMessage = `Ошибка удаления: ${response.status}`;
        }
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('File deletion failed:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Не удалось удалить файл. Попробуйте позже.');
  }
};

/**
 * Gets file info from the server.
 * @param fileId The ID of the file.
 */
export const getFileInfo = async (fileId: string): Promise<{ url: string; size: number; type: string; name: string }> => {
  try {
    const response = await fetchWithAuth(`${API_CONFIG.BASE_URL}/files/${fileId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Не удалось получить информацию о файле');
    }

    return await response.json();
  } catch (error) {
    console.error('Get file info failed:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Не удалось получить информацию о файле');
  }
};
