import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Target } from 'lucide-react';
import { useTasks } from '../contexts/TasksContext';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from '../hooks/useTranslation';
import { TaskForm } from '../components/tasks/TaskForm';
import { CreateTaskData } from '../types';
import { Button } from '../components/common/Button';

export const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTask } = useTasks();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      await createTask(data);
      showToast(t('tasks.taskCreatedSuccess'), 'success');
      navigate('/tasks');
    } catch (error) {
      showToast(t('tasks.failedToCreateTask'), 'error');
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/tasks')}
            className="mb-6 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('tasks.backToTasks')}
          </Button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {t('tasks.createNewTask')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('tasks.addNewTask')}
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {t('tasks.taskTitle')} & {t('tasks.description')}
              </h2>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={handleCancel}
              submitLabel={t('tasks.createTask')}
            />
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
            Tips for Better Task Management
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Be Specific</h4>
                <p className="text-sm text-gray-600">Write clear, actionable task titles that describe exactly what needs to be done.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Set Deadlines</h4>
                <p className="text-sm text-gray-600">Adding deadlines helps prioritize tasks and maintain momentum.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Add Context</h4>
                <p className="text-sm text-gray-600">Use the description field to add important details or requirements.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Start Small</h4>
                <p className="text-sm text-gray-600">Break large tasks into smaller, manageable pieces for better progress tracking.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};