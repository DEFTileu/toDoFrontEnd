import { Task, CreateTaskData, UpdateTaskData } from '../types';
import { API_CONFIG } from './apiConfig';

const API_BASE_URL = 'http://localhost:8080/api';
const DEMO_TOKEN = 'demo_auth_token_12345';

// Demo tasks data
const DEMO_TASKS: Task[] = [
  {
    id: 'demo-task-1',
    title: 'Welcome to TaskFlow!',
    description: 'This is a demo task to show you how the application works. You can edit, complete, or delete this task.',
    status: 'todo',
    createdAt: '2024-01-15T10:00:00.000Z',
    deadline: '2024-01-20T23:59:59.000Z',
    userId: 'demo-user-123'
  },
  {
    id: 'demo-task-2',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new project including API endpoints and user guides.',
    status: 'done',
    createdAt: '2024-01-10T14:30:00.000Z',
    deadline: '2024-01-15T17:00:00.000Z',
    userId: 'demo-user-123'
  },
  {
    id: 'demo-task-3',
    title: 'Review code changes',
    description: 'Review the latest pull requests and provide feedback to team members.',
    status: 'in-progress',
    createdAt: '2024-01-12T09:15:00.000Z',
    userId: 'demo-user-123'
  }
];

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get demo tasks from localStorage or use default
const getDemoTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem('demo_tasks');
    return stored ? JSON.parse(stored) : [...DEMO_TASKS];
  } catch {
    return [...DEMO_TASKS];
  }
};

// Helper function to save demo tasks to localStorage
const saveDemoTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem('demo_tasks', JSON.stringify(tasks));
  } catch {
    // Ignore localStorage errors
  }
};

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to create headers with auth token
const createAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

// Helper function to create fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - server is overloaded or unresponsive');
    }
    throw error;
  }
};

export const tasksService = {
  async getTasks(): Promise<Task[]> {
    const token = getAuthToken();
    
    // Check if it's demo token
    if (token === DEMO_TOKEN) {
      await delay(500);
      return getDemoTasks();
    }
    
    // Otherwise, try real API call
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/tasks`, {
        method: 'GET',
        headers: createAuthHeaders(),
      });

      const data = await handleApiResponse(response);
      return data.tasks || [];
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  },

  async createTask(taskData: CreateTaskData): Promise<Task> {
    const token = getAuthToken();
    
    // Check if it's demo token
    if (token === DEMO_TOKEN) {
      await delay(600);
      
      const newTask: Task = {
        id: `demo-task-${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status || 'todo',
        createdAt: new Date().toISOString(),
        deadline: taskData.deadline,
        userId: 'demo-user-123'
      };
      
      const tasks = getDemoTasks();
      const updatedTasks = [newTask, ...tasks];
      saveDemoTasks(updatedTasks);
      
      return newTask;
    }
    
    // Otherwise, try real API call
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: createAuthHeaders(),
        body: JSON.stringify(taskData),
      });

      const data = await handleApiResponse(response);
      return data.task;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },

  async updateTask(taskData: UpdateTaskData): Promise<Task> {
    const token = getAuthToken();
    
    // Check if it's demo token
    if (token === DEMO_TOKEN) {
      await delay(500);
      
      const tasks = getDemoTasks();
      const taskIndex = tasks.findIndex(t => t.id === taskData.id);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      const updatedTask: Task = {
        ...tasks[taskIndex],
        ...taskData,
        id: taskData.id
      };
      
      tasks[taskIndex] = updatedTask;
      saveDemoTasks(tasks);
      
      return updatedTask;
    }
    
    // Otherwise, try real API call
    try {
      const { id, ...updateData } = taskData;
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: createAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await handleApiResponse(response);
      return data.task;
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  },

  async deleteTask(id: string): Promise<void> {
    const token = getAuthToken();
    
    // Check if it's demo token
    if (token === DEMO_TOKEN) {
      await delay(400);
      
      const tasks = getDemoTasks();
      const filteredTasks = tasks.filter(t => t.id !== id);
      saveDemoTasks(filteredTasks);
      
      return;
    }
    
    // Otherwise, try real API call
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: createAuthHeaders(),
      });

      await handleApiResponse(response);
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  },

  async updateTaskStatus(id: string, status: 'todo' | 'in-progress' | 'done'): Promise<Task> {
    const token = getAuthToken();
    
    // Check if it's demo token
    if (token === DEMO_TOKEN) {
      await delay(400);
      
      const tasks = getDemoTasks();
      const taskIndex = tasks.findIndex(t => t.id === id);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      const updatedTask: Task = {
        ...tasks[taskIndex],
        status
      };
      
      tasks[taskIndex] = updatedTask;
      saveDemoTasks(tasks);
      
      return updatedTask;
    }
    
    // Otherwise, try real API call
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: createAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      const data = await handleApiResponse(response);
      return data.task;
    } catch (error) {
      console.error('Update task status error:', error);
      throw error;
    }
  },
};