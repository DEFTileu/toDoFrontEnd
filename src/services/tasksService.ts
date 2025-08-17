import { Task, CreateTaskData, UpdateTaskData, Sprint, TaskPreview } from '../types';
import { API_CONFIG, API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES, fetchWithAuth } from './apiConfig';


const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = "";
    switch (response.status) {
      case HTTP_STATUS.BAD_REQUEST:
        errorMessage = ERROR_MESSAGES.VALIDATION_ERROR;
        break;
      case HTTP_STATUS.UNAUTHORIZED:
        errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
        break;
      case HTTP_STATUS.NOT_FOUND:
        errorMessage = ERROR_MESSAGES.NOT_FOUND;
        break;
      case HTTP_STATUS.CONFLICT:
        errorMessage = ERROR_MESSAGES.CONFLICT;
        break;
    }
    errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    
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


export const tasksService = {
  async getTasks(): Promise<Task[]> {

    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TASKS}`,

        { method: 'GET',
          headers: { 'Content-Type': 'application/json' }}
      );

      const data = await handleApiResponse(response);
      return data.tasks || data || [];
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  },

  async getTaskById(id: string): Promise<TaskPreview> {
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TASK_BY_ID(id)}`,

        { method: 'GET',
          headers: { 'Content-Type': 'application/json' },}
      );

      const data = await handleApiResponse(response);
      return {
        task: data.task || data,
        sprint: data.sprint
      };
    } catch (error) {
      console.error('Get task by ID error:', error);
      throw error;
    }
  },

  async createTask(taskData: CreateTaskData): Promise<Task> {

    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TASKS}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        }
      );

      const data = await handleApiResponse(response);
      return data.task || data;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },

  async updateTask(taskData: UpdateTaskData): Promise<Task> {

    try {
      const { id, ...updateData } = taskData;
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TASK_BY_ID(id)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        }
      );

      const data = await handleApiResponse(response);
      return data.task || data;
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TASK_BY_ID(id)}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      await handleApiResponse(response);
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  },

  async updateTaskStatus(id: string, status: 'todo' | 'in-progress' | 'done'): Promise<Task> {

    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TASK_STATUS(id)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }
      );

      const data = await handleApiResponse(response);
      return data.task || data;
    } catch (error) {
      console.error('Update task status error:', error);
      throw error;
    }
  },

  async addComment(taskId: string, content: string): Promise<Task> {

    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TASK_COMMENTS(taskId)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        }
      );

      const data = await handleApiResponse(response);
      return data.task || data;
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    }
  },

  async getSprints(): Promise<Sprint[]> {

    
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SPRINTS}`,
        { method: 'GET',
          headers: { 'Content-Type': 'application/json' },}
      );

      const data = await handleApiResponse(response);
      return data.sprints || data || [];
    } catch (error) {
      console.error('Get sprints error:', error);
      throw error;
    }
  },

  async getTasksBySprintId(sprintId: string): Promise<Task[]> {

    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SPRINT_TASKS(sprintId)}`,
        { method: 'GET',
          headers: { 'Content-Type': 'application/json' },}
      );

      const data = await handleApiResponse(response);
      return data.tasks || data || [];
    } catch (error) {
      console.error('Get tasks by sprint error:', error);
      throw error;
    }
  },

  async getActiveSprint(): Promise<Sprint | null> {

    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.ACTIVE_SPRINT}`,
        { method: 'GET',
          headers: { 'Content-Type': 'application/json' },}
      );

      const data = await handleApiResponse(response);
      return data.sprint || data;
    } catch (error) {
      console.error('Get active sprint error:', error);
      throw error;
    }
  },
};