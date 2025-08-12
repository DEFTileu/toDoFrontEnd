import { Task, CreateTaskData, UpdateTaskData, TaskComment, Sprint, TaskPreview } from '../types';
import { API_CONFIG, API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES, fetchWithAuth } from './apiConfig';

// Demo data fallback (for development/demo mode)
const DEMO_TOKEN = 'demo_auth_token_12345';

const DEMO_TASKS: Task[] = [
  {
    id: 'demo-task-1',
    title: 'Welcome to TaskFlow!',
    description: 'This is a demo task to show you how the application works. You can edit, complete, or delete this task.',
    status: 'todo',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
    deadline: '2024-01-20T23:59:59.000Z',
    userId: 'demo-user-123',
    comments: [],
    sprintId: 'current-sprint'
  },
  {
    id: 'demo-task-2',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new project including API endpoints and user guides.',
    status: 'done',
    createdAt: '2024-01-10T14:30:00.000Z',
    updatedAt: '2024-01-12T16:45:00.000Z',
    completedAt: '2024-01-12T16:45:00.000Z',
    deadline: '2024-01-15T17:00:00.000Z',
    userId: 'demo-user-123',
    comments: [
      {
        id: 'comment-1',
        userId: 'demo-user-123',
        userName: 'Demo User',
        content: 'Started working on the API documentation section.',
        createdAt: '2024-01-11T09:30:00.000Z'
      },
      {
        id: 'comment-2',
        userId: 'demo-user-123',
        userName: 'Demo User',
        content: 'Completed all sections. Ready for review!',
        createdAt: '2024-01-12T16:30:00.000Z'
      }
    ],
    sprintId: 'current-sprint'
  },
  {
    id: 'demo-task-3',
    title: 'Review code changes',
    description: 'Review the latest pull requests and provide feedback to team members.',
    status: 'in-progress',
    createdAt: '2024-01-12T09:15:00.000Z',
    updatedAt: '2024-01-13T11:20:00.000Z',
    userId: 'demo-user-123',
    comments: [],
    sprintId: 'current-sprint'
  }
];

const DEMO_SPRINTS: Sprint[] = [
  {
    id: 'current-sprint',
    name: 'Sprint 3 - January 2024',
    startDate: '2024-01-15T00:00:00.000Z',
    endDate: '2024-01-21T23:59:59.000Z',
    isActive: true,
    createdAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'sprint-2',
    name: 'Sprint 2 - January 2024',
    startDate: '2024-01-08T00:00:00.000Z',
    endDate: '2024-01-14T23:59:59.000Z',
    isActive: false,
    createdAt: '2024-01-08T00:00:00.000Z'
  },
  {
    id: 'sprint-1',
    name: 'Sprint 1 - January 2024',
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: '2024-01-07T23:59:59.000Z',
    isActive: false,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

// Helper functions for demo mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getDemoTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem('demo_tasks');
    return stored ? JSON.parse(stored) : [...DEMO_TASKS];
  } catch {
    return [...DEMO_TASKS];
  }
};

const saveDemoTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem('demo_tasks', JSON.stringify(tasks));
  } catch {
    // Ignore localStorage errors
  }
};

const getDemoSprints = (): Sprint[] => {
  try {
    const stored = localStorage.getItem('demo_sprints');
    return stored ? JSON.parse(stored) : [...DEMO_SPRINTS];
  } catch {
    return [...DEMO_SPRINTS];
  }
};

// Helper functions for API calls
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    
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

const isDemoMode = (): boolean => {
  return getAuthToken() === DEMO_TOKEN;
};

export const tasksService = {
  async getTasks(): Promise<Task[]> {
    if (isDemoMode()) {
      await delay(500);
      const tasks = getDemoTasks();
      const currentSprint = getDemoSprints().find(s => s.isActive);
      if (currentSprint) {
        return tasks.filter(task => {
          if (task.status === 'done' && task.completedAt) {
            const completedDate = new Date(task.completedAt);
            const sprintStart = new Date(currentSprint.startDate);
            return completedDate >= sprintStart;
          }
          return true;
        });
      }
      return tasks;
    }
    
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TASKS}`,
        { method: 'GET' }
      );

      const data = await handleApiResponse(response);
      return data.tasks || data || [];
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  },

  async getTaskById(id: string): Promise<TaskPreview> {
    if (isDemoMode()) {
      await delay(300);
      const tasks = getDemoTasks();
      const sprints = getDemoSprints();
      const task = tasks.find(t => t.id === id);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      const sprint = sprints.find(s => s.id === task.sprintId);
      return { task, sprint };
    }
    
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TASK_BY_ID(id)}`,
        { method: 'GET' }
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
    if (isDemoMode()) {
      await delay(600);
      
      const newTask: Task = {
        id: `demo-task-${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status || 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deadline: taskData.deadline,
        userId: 'demo-user-123',
        comments: [],
        sprintId: 'current-sprint'
      };
      
      const tasks = getDemoTasks();
      const updatedTasks = [newTask, ...tasks];
      saveDemoTasks(updatedTasks);
      
      return newTask;
    }
    
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TASKS}`,
        {
          method: 'POST',
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
    if (isDemoMode()) {
      await delay(500);
      
      const tasks = getDemoTasks();
      const taskIndex = tasks.findIndex(t => t.id === taskData.id);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      const updatedTask: Task = {
        ...tasks[taskIndex],
        ...taskData,
        id: taskData.id,
        updatedAt: new Date().toISOString()
      };
      
      tasks[taskIndex] = updatedTask;
      saveDemoTasks(tasks);
      
      return updatedTask;
    }
    
    try {
      const { id, ...updateData } = taskData;
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TASK_BY_ID(id)}`,
        {
          method: 'PUT',
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
    if (isDemoMode()) {
      await delay(400);
      
      const tasks = getDemoTasks();
      const filteredTasks = tasks.filter(t => t.id !== id);
      saveDemoTasks(filteredTasks);
      
      return;
    }
    
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TASK_BY_ID(id)}`,
        {
          method: 'DELETE',
        }
      );

      await handleApiResponse(response);
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  },

  async updateTaskStatus(id: string, status: 'todo' | 'in-progress' | 'done'): Promise<Task> {
    if (isDemoMode()) {
      await delay(400);
      
      const tasks = getDemoTasks();
      const taskIndex = tasks.findIndex(t => t.id === id);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      const updatedTask: Task = {
        ...tasks[taskIndex],
        status,
        updatedAt: new Date().toISOString(),
        completedAt: status === 'done' ? new Date().toISOString() : undefined
      };
      
      tasks[taskIndex] = updatedTask;
      saveDemoTasks(tasks);
      
      return updatedTask;
    }
    
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TASK_STATUS(id)}`,
        {
          method: 'PATCH',
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
    if (isDemoMode()) {
      await delay(300);
      
      const tasks = getDemoTasks();
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      const newComment: TaskComment = {
        id: `comment-${Date.now()}`,
        userId: 'demo-user-123',
        userName: 'Demo User',
        content,
        createdAt: new Date().toISOString()
      };
      
      const updatedTask: Task = {
        ...tasks[taskIndex],
        comments: [...tasks[taskIndex].comments, newComment],
        updatedAt: new Date().toISOString()
      };
      
      tasks[taskIndex] = updatedTask;
      saveDemoTasks(tasks);
      
      return updatedTask;
    }
    
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TASK_COMMENTS(taskId)}`,
        {
          method: 'POST',
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
    if (isDemoMode()) {
      await delay(400);
      return getDemoSprints();
    }
    
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SPRINTS}`,
        { method: 'GET' }
      );

      const data = await handleApiResponse(response);
      return data.sprints || data || [];
    } catch (error) {
      console.error('Get sprints error:', error);
      throw error;
    }
  },

  async getTasksBySprintId(sprintId: string): Promise<Task[]> {
    if (isDemoMode()) {
      await delay(500);
      
      const allTasks = getDemoTasks();
      return allTasks.filter(task => task.sprintId === sprintId);
    }
    
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SPRINT_TASKS(sprintId)}`,
        { method: 'GET' }
      );

      const data = await handleApiResponse(response);
      return data.tasks || data || [];
    } catch (error) {
      console.error('Get tasks by sprint error:', error);
      throw error;
    }
  },

  async getActiveSprint(): Promise<Sprint | null> {
    if (isDemoMode()) {
      await delay(300);
      const sprints = getDemoSprints();
      return sprints.find(s => s.isActive) || null;
    }
    
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.ACTIVE_SPRINT}`,
        { method: 'GET' }
      );

      const data = await handleApiResponse(response);
      return data.sprint || data;
    } catch (error) {
      console.error('Get active sprint error:', error);
      throw error;
    }
  },
};