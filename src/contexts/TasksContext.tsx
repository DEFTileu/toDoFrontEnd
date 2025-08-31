import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { Task, TasksState, CreateTaskData, UpdateTaskData, TaskPreview } from '../types';
import { tasksService } from '../services/tasksService';

interface TasksContextType extends TasksState {
  fetchTasks: () => Promise<void>;
  getTaskById: (id: string) => Promise<TaskPreview>;
  createTask: (data: CreateTaskData) => Promise<void>;
  updateTask: (data: UpdateTaskData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: 'todo' | 'in-progress' | 'done') => Promise<void>;
  addComment: (taskId: string, content: string) => Promise<void>;
  deleteComment: (taskId: string, commentId: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

type TasksAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Task[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'CLEAR_ERROR' };

const tasksReducer = (state: TasksState, action: TasksAction): TasksState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { tasks: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  const fetchTasks = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const tasks = await tasksService.getTasks();
      dispatch({ type: 'FETCH_SUCCESS', payload: tasks });
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('timeout') || errorMessage.includes('overloaded')) {
        dispatch({ type: 'FETCH_ERROR', payload: 'Server is overloaded or unresponsive. Please try again later.' });
      } else {
        dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      }
    }
  }, []);

  const getTaskById = useCallback(async (id: string): Promise<TaskPreview> => {
    try {
      return await tasksService.getTaskById(id);
    } catch (error) {
      throw error;
    }
  }, []);

  const createTask = useCallback(async (data: CreateTaskData) => {
    try {
      const task = await tasksService.createTask(data);
      dispatch({ type: 'ADD_TASK', payload: task });
    } catch (error) {
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (data: UpdateTaskData) => {
    try {
      const task = await tasksService.updateTask(data);
      dispatch({ type: 'UPDATE_TASK', payload: task });
    } catch (error) {
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await tasksService.deleteTask(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (error) {
      throw error;
    }
  }, []);

  const updateTaskStatus = useCallback(async (id: string, status: 'todo' | 'in-progress' | 'done') => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      const originalStatus = task.status;
      
      // Optimistic update - immediately update UI
      dispatch({ type: 'UPDATE_TASK', payload: { ...task, status } });
      
      try {
        const updatedTask = await tasksService.updateTaskStatus(id, status);
        // Update with the actual response from server (in case there are additional fields)
        dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      } catch (error) {
        // Rollback to original status on error
        dispatch({ type: 'UPDATE_TASK', payload: { ...task, status: originalStatus } });
        throw error;
      }
    }
  }, [state.tasks]);

  const addComment = useCallback(async (taskId: string, content: string) => {
  try {
    const updatedTask = await tasksService.addComment(taskId, content);
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  } catch (error) {
    throw error;
  }
}, []);

const deleteComment = useCallback(async (taskId: string, commentId: string) => {
  try {
    const updatedTask = await tasksService.deleteComment(taskId, commentId);
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  } catch (error) {
    throw error;
  }
}, []);


  const value: TasksContextType = {
    ...state,
    fetchTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    addComment,
    deleteComment,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};