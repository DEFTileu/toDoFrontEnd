export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  emailNotification: boolean;
  pushNotification: boolean;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  deadline?: string;
  userId: string;
  comments: TaskComment[];
  subtasks: String[];
  sprintId?: string;
}

export interface TaskComment {
  id: string;
  user: User;
  content: string;
  createdAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
}

export interface TaskPreview {
  task: Task;
  sprint?: Sprint;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface CreateTaskData {
  title: string;
  description: string;
  deadline?: string;
  status?: 'todo' | 'in-progress' | 'done';
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
  confirmPassword: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
    refreshToken: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  isNotification?: boolean; // Новый параметр для push-уведомлений
}
export type TaskStatus = 'todo' | 'in-progress' | 'done';
