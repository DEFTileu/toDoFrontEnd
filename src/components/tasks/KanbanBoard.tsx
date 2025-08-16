import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { useTasks } from '../../contexts/TasksContext';
import { useToast } from '../../contexts/ToastContext';
import { useTranslation } from '../../hooks/useTranslation';
import { KanbanColumn } from './KanbanColumn';
import { Modal } from '../common/Modal';
import { TaskForm } from './TaskForm';
import { TaskPreviewModal } from './TaskPreviewModal';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../common/Button';
import { Task, CreateTaskData, TaskStatus } from '../../types';

export const KanbanBoard: React.FC = () => {
  const { tasks, loading, error, fetchTasks, createTask, updateTask, updateTaskStatus, getTaskById } = useTasks();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    
    try {
      await updateTaskStatus(draggableId, newStatus);
      const statusText = newStatus === 'todo' ? t('tasks.todo') : 
                        newStatus === 'in-progress' ? t('tasks.inProgress') : 
                        t('tasks.done');
      showToast(`${t('tasks.taskMovedTo')} ${statusText}`, 'success');
    } catch (error) {
      showToast(t('tasks.failedToUpdateStatus'), 'error');
    }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsPreviewModalOpen(true);
  };

  const handleEditFromPreview = async (taskId: string) => {
    try {
      const taskPreview = await getTaskById(taskId);
      setSelectedTaskForEdit(taskPreview.task);
      setIsEditModalOpen(true);
    } catch (error) {
      showToast('Failed to load task for editing', 'error');
    }
  };

  const handleUpdateTask = async (data: CreateTaskData) => {
    if (!selectedTaskForEdit) return;

    setIsUpdating(true);
    try {
      await updateTask({ id: selectedTaskForEdit.id, ...data });
      setSelectedTaskForEdit(null);
      setIsEditModalOpen(false);
      showToast(t('tasks.taskUpdatedSuccess'), 'success');
    } catch (error) {
      showToast(t('tasks.failedToUpdateTask'), 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateTask = async (data: CreateTaskData) => {
    setIsCreating(true);
    try {
      await createTask(data);
      setIsCreateModalOpen(false);
      showToast(t('tasks.taskCreatedSuccess'), 'success');
    } catch (error) {
      showToast(t('tasks.failedToCreateTask'), 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setSelectedTaskId(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTaskForEdit(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text={t('common.loadingTasks')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              {error.includes('overloaded') || error.includes('timeout') 
                ? t('common.serverBusy')
                : t('common.errorLoadingTasks')
              }
            </h3>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <Button onClick={fetchTasks} variant="secondary" size="sm">
              {t('common.tryAgain')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('tasks.taskBoard')}</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {tasks.length === 0 
              ? t('tasks.noTasksYet')
              : `${todoTasks.length} to do, ${inProgressTasks.length} in progress, ${doneTasks.length} completed`
            }
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('tasks.newTask')}
        </Button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-h-[60vh] md:h-[calc(100vh-200px)]">
          <KanbanColumn
            status="todo"
            title={t('tasks.todo')}
            tasks={todoTasks}
            onTaskClick={handleTaskClick}
          />
          <KanbanColumn
            status="in-progress"
            title={t('tasks.inProgress')}
            tasks={inProgressTasks}
            onTaskClick={handleTaskClick}
          />
          <KanbanColumn
            status="done"
            title={t('tasks.done')}
            tasks={doneTasks}
            onTaskClick={handleTaskClick}
          />
        </div>
      </DragDropContext>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('tasks.createNewTask')}
        size="lg"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
          submitLabel={t('tasks.createTask')}
          isLoading={isCreating}
        />
      </Modal>

      {/* Task Preview Modal */}
      <TaskPreviewModal
        taskId={selectedTaskId}
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreviewModal}
        onEdit={handleEditFromPreview}
      />

      {/* Task Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title={t('tasks.editTask')}
        size="xl"
      >
        {selectedTaskForEdit && (
          <div className="space-y-8">
            <TaskForm
              initialData={{
                title: selectedTaskForEdit.title,
                description: selectedTaskForEdit.description,
                deadline: selectedTaskForEdit.deadline,
                status: selectedTaskForEdit.status,
              }}
              onSubmit={handleUpdateTask}
              onCancel={handleCloseEditModal}
              submitLabel={t('tasks.updateTask')}
              isLoading={isUpdating}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};