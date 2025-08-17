import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from './apiConfig';
import { fetchWithAuth } from './apiConfig';
import {Sprint} from "../types";

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Use default error message if response is not JSON
    }
    throw new Error(errorMessage);
  }

  if (response.status === HTTP_STATUS.NO_CONTENT) {
    return null;
  }

  return response.json();
};

export const sprintService = {
  async editSprint(sprintId: string, data: { name?: string; goal?: string }): Promise<{ sprint: Sprint }> {
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}/sprints/${sprintId}/edit`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error editing sprint:', error);
      throw error;
    }
  },

  async getSprints(): Promise<any> {
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}/sprints`,
        { method: 'GET',
          headers: { 'Content-Type': 'application/json' },}
      );
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching sprints:', error);
      throw error;
    }
  },

  async getSprintTasks(sprintId: string): Promise<any> {
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}/sprints/${sprintId}/tasks`,
        { method: 'GET',
          headers: { 'Content-Type': 'application/json' },}
      );
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching sprint tasks:', error);
      throw error;
    }
  },
};
