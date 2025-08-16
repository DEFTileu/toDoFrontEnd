import React, { useEffect, useState } from 'react';
import { Calendar, CheckSquare, Clock, Target, ArrowRight, MessageSquare, TrendingUp, Edit } from 'lucide-react';
import { sprintService } from '../services/sprintService';
import { useTranslation } from '../hooks/useTranslation';
import { TaskPreviewModal } from '../components/tasks/TaskPreviewModal';
import { Sprint, Task } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatDate, truncateText } from '../utils/formatters';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';

export const SprintHistoryPage: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [sprintTasks, setSprintTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSprintName, setEditedSprintName] = useState<string>('');
  const [editedSprintGoal, setEditedSprintGoal] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    fetchSprints();
  }, []);

  const fetchSprints = async () => {
    try {
      const response = await sprintService.getSprints();
      const sprints: Sprint[] = response.sprints || [];

      if (sprints.length === 0) {
        console.warn(t('sprints.noSprintsFound'));
      }
      setSprints(sprints.sort((a: Sprint, b: Sprint) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
    } catch (error) {
      console.error(t('sprints.fetchError'), error);
    } finally {
      setLoading(false);
    }
  };

  const handleSprintUpdate = async (sprintId: string, updatedData: { name?: string; goal?: string }) => {
    try {
      const response = await sprintService.editSprint(sprintId, updatedData);
      const updatedSprint = response.sprint;

      setSprints(prevSprints =>
        prevSprints.map(sprint =>
          sprint.id === sprintId ? { ...sprint, ...updatedSprint } : sprint
        )
      );
    } catch (error) {
      console.error(t('sprints.updateError'), error);
    }
  };

  const handleSprintClick = async (sprint: Sprint) => {
    setSelectedSprint(sprint);
    setTasksLoading(true);
    try {
      const data = await sprintService.getSprintTasks(sprint.id);
      const tasks = data.tasks || [];
      if (!Array.isArray(tasks)) {
        console.error(t('tasks.invalidData'));
        setSprintTasks([]);
        return;
      }
      setSprintTasks(tasks);
    } catch (error) {
      console.error(t('tasks.fetchError'), error);
      setSprintTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setSelectedTaskId(null);
  };

  const handleEditFromPreview = (taskId: string) => {
    // For sprint history, we might want to redirect to main tasks page
    // or show a read-only message since these are historical tasks
    console.log('Edit task from sprint history:', taskId);
  };

  const handleEditClick = (sprint: Sprint) => {
    setSelectedSprint(sprint);
    setEditedSprintName(sprint.name);
    setEditedSprintGoal(sprint.goal || '');
    setIsEditing(true);
  };

  const handleSaveSprint = async () => {
    if (!selectedSprint || !editedSprintName.trim()) return;
    try {
      await handleSprintUpdate(selectedSprint.id, {
        name: editedSprintName.trim(),
        goal: editedSprintGoal.trim() || undefined
      });
      setIsEditing(false);
    } catch (error) {
      console.error(t('sprints.updateError'), error);
    }
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <div className="w-3 h-3 rounded-full bg-blue-500" />;
      case 'in-progress':
        return <Clock className="w-3 h-3 text-yellow-600" />;
      case 'done':
        return <CheckSquare className="w-3 h-3 text-green-600" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading sprints..." />
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {t('nav.sprints')}
                </h1>
                <p className="text-lg text-gray-600 mt-2">{t('sprints.manageAndReview')}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Sprints List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-indigo-600" />
                    {t('sprints.allSprints')}
                  </h2>
                </div>
                <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  {sprints.map((sprint) => {
                    const isSelected = selectedSprint?.id === sprint.id;
                    return (
                      <button
                        key={sprint.id}
                        onClick={() => handleSprintClick(sprint)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                          isSelected
                            ? 'border-indigo-300 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-gray-900 text-lg">{sprint.name}</h3>
                          {sprint.active && (
                            <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full border border-green-200">
                              {t('sprints.active')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(sprint.startDate)}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span>{formatDate(sprint.endDate)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sprint Details */}
            <div className="lg:col-span-8">
              {!selectedSprint ? (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('sprints.selectSprint')}</h3>
                  <p className="text-gray-600 text-lg">{t('sprints.chooseSprint')}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Sprint Header */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-3xl font-bold">{selectedSprint.name}</h2>
                        <div className="flex items-center space-x-4">
                          {selectedSprint.active && (
                            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-bold rounded-full border border-white/30">
                              {t('sprints.activeSprint')}
                            </span>
                          )}
                          <button
                            onClick={() => handleEditClick(selectedSprint)}
                            className="w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30 hover:bg-white/30"
                            aria-label="Edit Sprint"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      {selectedSprint.goal && (
                        <div className="flex items-center space-x-2 mb-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                          <Target className="w-5 h-5" />
                          <p className="text-white/90">{selectedSprint.goal}</p>
                        </div>
                      )}
                      <div className="flex items-center space-x-6 text-white/90">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5" />
                          <span className="font-medium">{formatDate(selectedSprint.startDate)}</span>
                        </div>
                        <ArrowRight className="w-5 h-5" />
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5" />
                          <span className="font-medium">{formatDate(selectedSprint.endDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sprint Statistics */}
                    {sprintTasks.length > 0 && (
                      <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50">
                        <div className="flex items-center mb-4">
                          <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                          <h3 className="text-lg font-bold text-gray-900">Sprint Overview</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="text-2xl font-bold text-gray-900">{sprintTasks.length}</div>
                            <div className="text-sm text-gray-600">Total Tasks</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-xl shadow-sm border border-blue-100">
                            <div className="text-2xl font-bold text-blue-600">
                              {sprintTasks.filter(t => t.status === 'todo').length}
                            </div>
                            <div className="text-sm text-blue-700">To Do</div>
                          </div>
                          <div className="text-center p-4 bg-yellow-50 rounded-xl shadow-sm border border-yellow-100">
                            <div className="text-2xl font-bold text-yellow-600">
                              {sprintTasks.filter(t => t.status === 'in-progress').length}
                            </div>
                            <div className="text-sm text-yellow-700">In Progress</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-xl shadow-sm border border-green-100">
                            <div className="text-2xl font-bold text-green-600">
                              {sprintTasks.filter(t => t.status === 'done').length}
                            </div>
                            <div className="text-sm text-green-700">Completed</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tasks */}
                    {tasksLoading ? (
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">
                        <LoadingSpinner size="md" text="Loading tasks..." />
                      </div>
                    ) : sprintTasks.length === 0 ? (
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckSquare className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Tasks Found</h3>
                        <p className="text-gray-600">This sprint doesn't have any tasks yet</p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                          <CheckSquare className="w-5 h-5 mr-2 text-indigo-600" />
                          Sprint Tasks ({sprintTasks.length})
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          {sprintTasks.map((task) => (
                            <div
                              key={task.id}
                              className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                              onClick={() => handleTaskClick(task.id)}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-bold text-gray-900 leading-6 flex-1 mr-3">
                                  {truncateText(task.title, 50)}
                                </h4>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  {getStatusIcon(task.status)}
                                </div>
                              </div>

                              {task.description && (
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed break-words line-clamp-2">
                                  {truncateText(task.description, 100)}
                                </p>
                              )}

                              <div className="flex items-center justify-between">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(task.status)}`}>
                                  {task.status === 'todo' ? t('tasks.todo') :
                                   task.status === 'in-progress' ? t('tasks.inProgress') :
                                   t('tasks.done')}
                                </span>

                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                  {task.comments.length > 0 && (
                                    <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded-full">
                                      <MessageSquare className="w-3 h-3" />
                                      <span className="font-medium">{task.comments.length}</span>
                                    </div>
                                  )}
                                  <span className="bg-white px-2 py-1 rounded-full font-medium">
                                    {formatDate(task.createdAt)}
                                  </span>
                                </div>
                              </div>

                              {task.completedAt && (
                                <div className="mt-4 pt-3 border-t border-gray-200">
                                  <div className="flex items-center space-x-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                                    <CheckSquare className="w-3 h-3" />
                                    <span className="font-medium">Completed on {formatDate(task.completedAt)}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Task Preview Modal */}
        <TaskPreviewModal
          taskId={selectedTaskId}
          isOpen={isPreviewModalOpen}
          onClose={handleClosePreviewModal}
          onEdit={handleEditFromPreview}
        />

        {/* Модальное окно для редактирования */}
        <Modal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
        >
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold">{t('sprints.editSprint')}</h3>
            <Input
              label={t('sprints.sprintName')}
              value={editedSprintName}
              onChange={(e) => setEditedSprintName(e.target.value)}
              required
            />
            <Textarea
              label={t('sprints.sprintGoal')}
              value={editedSprintGoal}
              onChange={(e) => setEditedSprintGoal(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <Button onClick={() => setIsEditing(false)}>{t('common.cancel')}</Button>
              <Button
                onClick={handleSaveSprint}
                variant="primary"
                disabled={
                  !editedSprintName.trim() ||
                  ((editedSprintName.trim() === selectedSprint?.name) &&
                  (editedSprintGoal.trim() === (selectedSprint?.goal || '')))
                }
              >
                {t('common.save')}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
