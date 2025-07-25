import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Edit3, Trash2, Clock, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Task } from '../../types';
import { formatDate, formatDeadline, truncateText } from '../../utils/formatters';
import { useTasks } from '../../contexts/TasksContext';
import { useToast } from '../../contexts/ToastContext';

interface TaskCardProps {
  task: Task;
  index: number;
  onTaskClick: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onTaskClick }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteTask } = useTasks();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.confirm(t('tasks.confirmDelete'))) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      showToast(t('tasks.taskDeletedSuccess'), 'success');
    } catch (error) {
      showToast(t('tasks.failedToDeleteTask'), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTaskClick(task);
  };

  const handleCardClick = () => {
    onTaskClick(task);
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'done';

  const getStatusIcon = () => {
    switch (task.status) {
      case 'todo':
        return <div className="w-3 h-3 rounded-full bg-blue-500" />;
      case 'in-progress':
        return <Clock className="w-3 h-3 text-yellow-600" />;
      case 'done':
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  const getCardStyle = () => {
    if (task.status === 'done') {
      return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
    }
    if (isOverdue) {
      return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
    }
    return 'bg-white border-gray-200';
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleCardClick}
          className={`
            group relative rounded-xl shadow-sm border-2 transition-all duration-200 cursor-pointer
            hover:shadow-md hover:scale-[1.02] hover:-translate-y-1
            ${getCardStyle()}
            ${snapshot.isDragging ? 'shadow-lg rotate-3 scale-105' : ''}
          `}
        >
          {/* Status indicator */}
          <div className="absolute top-3 right-3 flex items-center space-x-1">
            {getStatusIcon()}
          </div>
          
          <div className="p-4">
            {/* Title */}
            <h3 className={`
              text-lg font-bold leading-6 mb-2 pr-6
              ${task.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-900'}
            `}>
              {truncateText(task.title, 50)}
            </h3>

            {/* Description */}
            {task.description && (
              <p className={`
                text-sm mb-3 leading-relaxed
                ${task.status === 'done' ? 'text-gray-400' : 'text-gray-700'}
              `}>
                {truncateText(task.description, 100)}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {formatDate(task.createdAt)}
              </span>
              {task.deadline && (
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                  isOverdue && task.status !== 'done'
                    ? 'bg-red-100 text-red-700' 
                    : task.status === 'done'
                      ? 'bg-gray-100 text-gray-400' 
                      : 'bg-blue-100 text-blue-700'
                }`}>
                  <Calendar className="w-3 h-3" />
                  <span className="font-medium text-xs">
                    {formatDeadline(task.deadline)}
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute top-2 right-8 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleEdit}
                className="p-1.5 text-gray-400 hover:text-indigo-600 transition-all duration-200 rounded-lg hover:bg-indigo-50 hover:scale-110"
                aria-label={t('tasks.editTaskAction')}
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 text-gray-400 hover:text-red-600 transition-all duration-200 rounded-lg hover:bg-red-50 hover:scale-110 disabled:opacity-50"
                aria-label={t('tasks.deleteTask')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};