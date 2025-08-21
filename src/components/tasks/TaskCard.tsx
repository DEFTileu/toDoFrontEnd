import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import {Calendar, MessageSquare, Clock, CheckCircle, AlertCircle} from 'lucide-react';
import { Task } from '../../types';
import { formatDate, formatDeadline, truncateText } from '../../utils/formatters';
import { useTranslation } from '../../hooks/useTranslation';

interface TaskCardProps {
  task: Task;
  index: number;
  onTaskClick: (taskId: string) => void;
  onSubtaskToggle?: (taskId: string, subtaskId: string, completed: boolean) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onTaskClick}) => {
  const { t } = useTranslation();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />;
      case 'in-progress':
        return <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0" />;
      case 'done':
        return <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0" />;
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
  const isDueSoon = task.deadline && !isOverdue &&
      new Date(task.deadline).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

  return (
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`
            group relative bg-white rounded-xl shadow-sm border border-gray-100 
            hover:shadow-lg hover:border-gray-200 transition-all duration-300 
            cursor-grab active:cursor-grabbing overflow-hidden
            ${getStatusColor(task.status)}
            ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-200 ring-opacity-60 rotate-1 scale-105' : ''}
            ${isOverdue ? 'bg-gradient-to-r from-red-50 to-white border-red-200' : ''}
            ${isDueSoon ? 'bg-gradient-to-r from-orange-50 to-white border-orange-200' : ''}
          `}
            >

              <div
                  className="p-4 pl-8 cursor-pointer"
                  onClick={() => onTaskClick(task.id)}
              >
                {/* Task Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getStatusIcon(task.status)}
                    <h3 className={`
                  font-semibold text-gray-900 leading-tight flex-1 break-words
                  text-base sm:text-lg
                  ${task.status === 'done' ? 'line-through text-gray-500' : ''}
                `}>
                      {truncateText(task.title, 80)}
                    </h3>
                  </div>
                </div>

                {/* Task Description */}
                {task.description && (
                    <div className="mb-4">
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">
                  <span
                      className="line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: truncateText(task.description.replace(/<[^>]*>/g, ''), 120)
                      }}
                  />
                      </p>
                    </div>
                )}

                {/* Task Meta Information */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Creation Date */}
                    <div className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg transition-colors">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 font-medium">{formatDate(task.createdAt)}</span>
                    </div>

                    {/* Comments Count */}
                    {task.comments && task.comments.length > 0 && (
                        <div className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1.5 rounded-lg transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span className="font-medium">{task.comments.length}</span>
                        </div>
                    )}


                  </div>

                  {/* Deadline */}
                  {task.deadline && (
                      <div className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-colors
                  ${isOverdue
                          ? 'bg-red-100 hover:bg-red-200 text-red-800'
                          : isDueSoon
                              ? 'bg-orange-100 hover:bg-orange-200 text-orange-800'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }
                `}>
                        {isOverdue ? (
                            <AlertCircle className="w-4 h-4" />
                        ) : (
                            <Clock className="w-4 h-4" />
                        )}
                        <span className="whitespace-nowrap">
                    {isOverdue
                        ? t('common.overdue')
                        : formatDeadline(task.deadline)
                    }
                  </span>
                      </div>
                  )}
                </div>

                {/* Completion Info */}
                {task.status === 'done' && task.completedAt && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">
                    {t('tasks.completedOn')} {formatDate(task.completedAt)}
                  </span>
                      </div>
                    </div>
                )}

              </div>
            </div>
        )}
      </Draggable>
  );
};