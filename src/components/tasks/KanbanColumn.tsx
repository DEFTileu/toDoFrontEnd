import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { useTranslation } from '../../hooks/useTranslation';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

const getColumnColor = (status: TaskStatus) => {
  switch (status) {
    case 'todo':
      return 'border-blue-200 bg-blue-50';
    case 'in-progress':
      return 'border-yellow-200 bg-yellow-50';
    case 'done':
      return 'border-green-200 bg-green-50';
    default:
      return 'border-gray-200 bg-gray-50';
  }
};

const getHeaderColor = (status: TaskStatus) => {
  switch (status) {
    case 'todo':
      return 'text-blue-700 bg-blue-100';
    case 'in-progress':
      return 'text-yellow-700 bg-yellow-100';
    case 'done':
      return 'text-green-700 bg-green-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  tasks,
  onTaskClick
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col h-full rounded-lg border-2 ${getColumnColor(status)} min-h-[400px]`}>
      <div className={`px-3 sm:px-4 py-3 rounded-t-lg ${getHeaderColor(status)}`}>
        <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wide">
          {title} ({tasks.length})
        </h3>
      </div>
      
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 sm:p-4 space-y-3 min-h-[200px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-opacity-70' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onTaskClick={onTaskClick}
              />
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && (
              <div className="flex items-center justify-center h-32 text-gray-400 text-xs sm:text-sm text-center px-2">
                {t('tasks.dropTasksHere')}
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};