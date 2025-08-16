import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Task } from '../../types';
import { formatDate, formatDeadline, truncateText } from '../../utils/formatters';
import { useTranslation } from '../../hooks/useTranslation';

interface TaskCardProps {
  task: Task;
  index: number;
  onTaskClick: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onTaskClick }) => {
  const { t } = useTranslation();

  const getStatusIcon = (status: string) => {
    switch (status) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'border-l-blue-500';
      case 'in-progress':
        return 'border-l-yellow-500';
      case 'done':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-400';
    }
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'done';

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onTaskClick(task.id)}
          className={`
            bg-white rounded-lg shadow-sm border-l-4 p-3 sm:p-4 cursor-pointer
            transition-all duration-200 hover:shadow-md hover:scale-[1.02]
            ${getStatusColor(task.status)}
            ${snapshot.isDragging ? 'shadow-lg rotate-2 scale-105' : ''}
            ${isOverdue ? 'bg-red-50 border-red-300' : ''}
          `}
        >
          {/* Task Header */}
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight flex-1 mr-2">
              {truncateText(task.title, 60)}
            </h4>
            <div className="flex items-center space-x-1 flex-shrink-0">
              {getStatusIcon(task.status)}
            </div>
          </div>

          {/* Task Description */}
          {task.description && (
              <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed break-words line-clamp-2">
                {truncateText(task.description, 100)}
              </p>
          )}

          {/* Task Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              {/* Creation Date */}
              <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                <Calendar className="w-3 h-3" />
                <span className="font-medium">{formatDate(task.createdAt)}</span>
              </div>

              {/* Comments Count */}
              {task.comments && task.comments.length > 0 && (
                <div className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  <MessageSquare className="w-3 h-3" />
                  <span className="font-medium">{task.comments.length}</span>
                </div>
              )}
            </div>

            {/* Deadline */}
            {task.deadline && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                isOverdue 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {isOverdue ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
                <span className="font-medium text-xs">
                  {isOverdue ? t('common.overdue') : formatDeadline(task.deadline)}
                </span>
              </div>
            )}
          </div>

          {/* Completion Badge */}
          {task.status === 'done' && task.completedAt && (
            <div className="mt-3 pt-2 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                <span className="font-medium">Completed {formatDate(task.completedAt)}</span>
              </div>
            </div>
          )}

          {/* Drag Indicator */}
          {snapshot.isDragging && (
            <div className="absolute inset-0 bg-indigo-100 bg-opacity-50 rounded-lg border-2 border-indigo-300 border-dashed" />
          )}
        </div>
      )}
    </Draggable>
  );
};