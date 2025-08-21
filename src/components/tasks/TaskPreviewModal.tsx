import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Edit3, Trash2, User, Target, CheckCircle, AlertCircle, MessageSquare, Send } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTasks } from '../../contexts/TasksContext';
import { useToast } from '../../contexts/ToastContext';
import { TaskPreview } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatDate, formatDeadline, getInitials } from '../../utils/formatters';
import RichTextEditor from '../common/RichTextEditor.tsx';

interface TaskPreviewModalProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (taskId: string) => void;
}

export const TaskPreviewModal: React.FC<TaskPreviewModalProps> = ({
                                                                    taskId,
                                                                    isOpen,
                                                                    onClose,
                                                                    onEdit
                                                                  }) => {
  const [taskPreview, setTaskPreview] = useState<TaskPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [tempDescription, setTempDescription] = useState('');
  const [tempStatus, setTempStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');
  const { getTaskById, deleteTask, addComment, updateTask, updateTaskStatus } = useTasks();
  const { showToast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskPreview();
    } else {
      setTaskPreview(null);
      setEditingDescription(false);
      setEditingStatus(false);
    }
  }, [isOpen, taskId]);

  const fetchTaskPreview = async () => {
    if (!taskId) return;

    setLoading(true);
    try {
      const preview = await getTaskById(taskId);
      setTaskPreview(preview);
      setTempDescription(preview.task.description || '');
      setTempStatus(preview.task.status);
    } catch (error) {
      console.error('Failed to load task details:', error);
      showToast(t('tasks.failedToLoadDetails'), 'error');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (taskId) {
      onEdit(taskId);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!taskId || !taskPreview) return;

    if (!window.confirm(t('tasks.confirmDelete'))) {
      return;
    }

    setDeleting(true);
    try {
      await deleteTask(taskId);
      showToast(t('tasks.taskDeletedSuccess'), 'success');
      onClose();
    } catch (error) {
      showToast(t('tasks.failedToDeleteTask'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !taskId) return;

    setAddingComment(true);
    try {
      await addComment(taskId, newComment.trim());
      setNewComment('');
      showToast(t('comments.addSuccess'), 'success');
      await fetchTaskPreview();
    } catch (error) {
      console.error('Failed to add comment:', error);
      showToast(t('comments.addError'), 'error');
    } finally {
      setAddingComment(false);
    }
  };

  const handleDescriptionSave = async () => {
    if (!taskId || !taskPreview) return;

    try {
      await updateTask({
        id: taskId,
        description: tempDescription
      });
      setEditingDescription(false);
      showToast(t('tasks.descriptionUpdatedSuccess'), 'success');
      await fetchTaskPreview();
    } catch (error) {
      console.error('Failed to update description:', error);
      showToast(t('tasks.failedToUpdateDescription'), 'error');
    }
  };

  const handleStatusSave = async () => {
    if (!taskId || !taskPreview) return;

    try {
      await updateTaskStatus(taskId, tempStatus);
      setEditingStatus(false);
      await fetchTaskPreview();
      showToast(t('tasks.statusUpdatedSuccess'), 'success');
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast(t('tasks.failedToUpdateStatus'), 'error');
    }
  };

  const getStatusClasses = (status: string) => {
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
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo':
        return t('tasks.todo');
      case 'in-progress':
        return t('tasks.inProgress');
      case 'done':
        return t('tasks.done');
      default:
        return t('tasks.unknown');
    }
  };

  if (!isOpen) return null;

  return (
      <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="xl"
      >
        {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" text={t('tasks.loadingDetails')} />
            </div>
        ) : taskPreview ? (
            <div className="space-y-6">
              {/* Header with Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-2 break-words">
                    {taskPreview.task.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{t('tasks.createdLabel')} {formatDate(taskPreview.task.createdAt)}</span>
                    </div>
                    {taskPreview.task.comments.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{taskPreview.task.comments.length} {t('comments.title').toLowerCase()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button
                      onClick={handleEdit}
                      variant="secondary"
                      size="sm"
                      className="flex items-center space-x-2 min-w-0"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('tasks.edit')}</span>
                  </Button>
                  <Button
                      onClick={handleDelete}
                      variant="danger"
                      size="sm"
                      loading={deleting}
                      disabled={deleting}
                      className="flex items-center space-x-2 min-w-0"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('tasks.delete')}</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Description */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{t('tasks.descriptionSection')}</h3>
                      <button
                          onClick={() => setEditingDescription(true)}
                          className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        {t('tasks.doubleClickToEdit')}
                      </button>
                    </div>
                    <div
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[100px] cursor-pointer hover:bg-gray-100 transition-colors"
                        onDoubleClick={() => setEditingDescription(true)}
                    >
                      {editingDescription ? (
                          <div className="space-y-3">
                            <RichTextEditor
                                content={tempDescription}
                                onChange={setTempDescription}
                                placeholder={t('tasks.enterTaskDescription')}
                                minHeight="150px"
                                className="border-0"
                            />
                            <div className="flex items-center space-x-2">
                              <Button
                                  onClick={handleDescriptionSave}
                                  size="sm"
                              >
                                {t('common.save')}
                              </Button>
                              <Button
                                  onClick={() => {
                                    setEditingDescription(false);
                                    setTempDescription(taskPreview.task.description || '');
                                  }}
                                  variant="secondary"
                                  size="sm"
                              >
                                {t('common.cancel')}
                              </Button>
                            </div>
                          </div>
                      ) : (
                          <div className="prose prose-sm max-w-none">
                            {taskPreview.task.description ? (
                                <div dangerouslySetInnerHTML={{ __html: taskPreview.task.description }} />
                            ) : (
                                <div className="text-gray-500 italic">{t('tasks.enterTaskDescription')}</div>
                            )}
                          </div>
                      )}
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      {t('comments.title')} ({taskPreview.task.comments.length})
                    </h3>

                    {/* Comments List - показываем сразу */}
                    <div className="space-y-4 mb-6">
                      {taskPreview.task.comments.length === 0 ? (
                          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>{t('comments.noComments')}</p>
                          </div>
                      ) : (
                          <div className="max-h-96 overflow-y-auto space-y-3">
                            {taskPreview.task.comments.map((comment) => (
                                <div key={comment.id} className="flex space-x-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                  <div className="flex-shrink-0">
                                    {comment.user.avatar ? (
                                        <img
                                            src={comment.user.avatar}
                                            alt={comment.user.name}
                                            className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover ring-2 ring-indigo-100"
                                            onError={(e) => {
                                              // Fallback to initials if image fails to load
                                              const target = e.target as HTMLImageElement;
                                              target.style.display = 'none';
                                              const fallback = target.nextElementSibling as HTMLElement;
                                              if (fallback) fallback.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className={`w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium ${comment.user.avatar ? 'hidden' : 'flex'}`}
                                    >
                                      {getInitials(comment.user.name)}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                                      <span className="text-sm font-semibold text-gray-900">{comment.user.name}</span>
                                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                                    </div>
                                    {/* Превью комментария с форматированием */}
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700 [&_p]:mb-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2 [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded"
                                        dangerouslySetInnerHTML={{ __html: comment.content }}
                                    />
                                  </div>
                                </div>
                            ))}
                          </div>
                      )}
                    </div>

                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} className="border-t border-gray-200 pt-6">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('comments.addLabel')}
                          </label>
                          <div className="relative">
                            <RichTextEditor
                                content={newComment}
                                onChange={setNewComment}
                                placeholder={t('comments.placeholderRich')}
                                minHeight="120px"
                                className="border border-gray-300 rounded-lg"
                            />
                            <div className="mt-3 flex items-center justify-between">
                              <div className="text-xs text-gray-500">
                                <strong>{t('comments.formattingTips')}</strong> {t('comments.formattingExamples')}
                              </div>
                              <Button
                                  type="submit"
                                  loading={addingComment}
                                  disabled={addingComment || !newComment.trim()}
                                  size="sm"
                              >
                                <Send className="w-4 h-4 mr-2" />
                                {t('comments.post')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200 lg:sticky lg:top-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{t('tasks.properties')}</h3>

                    {/* Status */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        {t('tasks.status')}
                      </label>
                      <div
                          className={`cursor-pointer hover:opacity-80 transition-opacity ${editingStatus ? 'opacity-100' : ''}`}
                          onDoubleClick={() => setEditingStatus(true)}
                      >
                        {editingStatus ? (
                            <div className="space-y-2">
                              <select
                                  value={tempStatus}
                                  onChange={(e) => setTempStatus(e.target.value as 'todo' | 'in-progress' | 'done')}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  autoFocus
                              >
                                <option value="todo">{t('tasks.todo')}</option>
                                <option value="in-progress">{t('tasks.inProgress')}</option>
                                <option value="done">{t('tasks.done')}</option>
                              </select>
                              <div className="flex items-center space-x-1">
                                <Button
                                    onClick={handleStatusSave}
                                    size="sm"
                                    className="text-xs px-2 py-1"
                                >
                                  {t('common.save')}
                                </Button>
                                <Button
                                    onClick={() => {
                                      setEditingStatus(false);
                                      setTempStatus(taskPreview.task.status);
                                    }}
                                    variant="secondary"
                                    size="sm"
                                    className="text-xs px-2 py-1"
                                >
                                  {t('common.cancel')}
                                </Button>
                              </div>
                            </div>
                        ) : (
                            <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium border ${getStatusClasses(taskPreview.task.status)}`}>
                              {getStatusIcon(taskPreview.task.status)}
                              <span>{getStatusText(taskPreview.task.status)}</span>
                            </div>
                        )}
                      </div>
                      {!editingStatus && (
                          <p className="text-xs text-gray-400 mt-1">{t('tasks.doubleClickToEdit')}</p>
                      )}
                    </div>

                    {/* Sprint */}
                    {taskPreview.sprint && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            {t('tasks.sprint')}
                          </label>
                          <div className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200">
                            <Target className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {taskPreview.sprint.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {taskPreview.sprint.active ? t('tasks.active') : t('tasks.completed')}
                              </p>
                            </div>
                          </div>
                        </div>
                    )}

                    {/* Deadline */}
                    {taskPreview.task.deadline && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            {t('tasks.deadline')}
                          </label>
                          <div className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200">
                            {new Date(taskPreview.task.deadline) < new Date() && taskPreview.task.status !== 'done' ? (
                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            ) : (
                                <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium break-words ${
                                  new Date(taskPreview.task.deadline) < new Date() && taskPreview.task.status !== 'done'
                                      ? 'text-red-600'
                                      : 'text-gray-900'
                              }`}>
                                {formatDeadline(taskPreview.task.deadline)}
                              </p>
                            </div>
                          </div>
                        </div>
                    )}

                    {/* Created */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        {t('tasks.createdLabel')}
                      </label>
                      <div className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200">
                        <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 break-words">
                            {formatDate(taskPreview.task.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Last Updated */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        {t('tasks.lastUpdated')}
                      </label>
                      <div className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200">
                        <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 break-words">
                            {formatDate(taskPreview.task.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('tasks.notFound')}</h3>
                <p className="text-gray-500">{t('tasks.notFoundMessage')}</p>
              </div>
            </div>
        )}
      </Modal>
  );
};
