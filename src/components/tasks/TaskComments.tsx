import React, { useState } from 'react';
import { Send, MessageSquare, Trash2, MoreVertical } from 'lucide-react';
import { useTasks } from '../../contexts/TasksContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Task } from '../../types';
import { Button } from '../common/Button';
import RichTextEditor from '../common/RichTextEditor';
import { DeleteCommentModal } from '../common/DeleteCommentModal';
import { formatDate, getInitials } from '../../utils/formatters';

interface TaskCommentsProps {
  task: Task;
}

export const TaskComments: React.FC<TaskCommentsProps> = ({ task }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const { addComment, deleteComment } = useTasks();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();

  // ✅ Логируем ID текущего пользователя
  console.log("Текущий пользователь (user.id):", user?.id);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(task.id, newComment.trim());
      setNewComment('');
      setIsEditorExpanded(false);
      showToast(t('comments.addSuccess'), 'success');
    } catch (error) {
      showToast(t('comments.addError'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    setDeletingCommentId(commentToDelete);
    try {
      await deleteComment(task.id, commentToDelete);
      showToast(t('comments.deleteSuccess'), 'success');
      setCommentToDelete(null);
    } catch (error) {
      showToast(t('comments.deleteError'), 'error');
    } finally {
      setDeletingCommentId(null);
      setOpenMenuId(null);
    }
  };

  const openDeleteModal = (commentId: string) => {
    setCommentToDelete(commentId);
    setOpenMenuId(null);
  };

  const closeDeleteModal = () => {
    setCommentToDelete(null);
  };

  const toggleMenu = (commentId: string) => {
    setOpenMenuId(openMenuId === commentId ? null : commentId);
  };

  React.useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  return (
    <div className="space-y-6">
      {/* Add Comment Form - сверху */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          {t('comments.title')} ({task.comments?.length ?? 0})
        </h3>

        <form onSubmit={handleSubmitComment} className="space-y-4">
          {!isEditorExpanded ? (
            // Простой инпут
            <div
              onClick={() => setIsEditorExpanded(true)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-text hover:bg-gray-100 transition-colors"
            >
              {t('comments.placeholderRich')}
            </div>
          ) : (
            // Расширенный редактор
            <div className="space-y-3">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <RichTextEditor
                  content={newComment}
                  onChange={setNewComment}
                  placeholder={t('comments.placeholderRich')}
                  minHeight="120px"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <strong>{t('comments.formattingTips')}</strong> {t('comments.formattingExamples')}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditorExpanded(false);
                      setNewComment('');
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Отмена
                  </button>
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    loading={isSubmitting}
                    size="sm"
                    className="inline-flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {t('comments.post')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Comments List - снизу */}
      <div className="space-y-4">
        {(task.comments?.length ?? 0) === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t('comments.noComments')}</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
            {task.comments.map((comment) => {
              // ✅ Исправленное логирование
              // console.log(`Комментарий ID: ${comment.id}, Автор (comment.userId): ${comment.userId}, Сравнение (user.id === comment.userId): ${user?.id === comment.userId}`);

              return (
                <div
                  key={comment.id}
                  className="flex space-x-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm relative"
                >
                  <div className="flex-shrink-0">
                    {comment.user.avatar ? (
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium ${comment.user.avatar ? 'hidden' : 'flex'}`}
                    >
                      {getInitials(comment.user.name)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Исправленный заголовок комментария */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-900">
                          {comment.user.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>

                      {/* Actions Menu - только для автора комментария */}
                      {user?.id === comment.user.id && (
                        <div className="flex-shrink-0 relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMenu(comment.id);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                            disabled={deletingCommentId === comment.id}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openMenuId === comment.id && (
                            <div className="absolute right-0 top-8 z-10 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                              <button
                                onClick={() => openDeleteModal(comment.id)}
                                disabled={deletingCommentId === comment.id}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t('comments.delete')}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div
                      className="prose prose-sm max-w-none text-gray-700 [&_p]:mb-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2 [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded"
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Comment Modal */}
      <DeleteCommentModal
        isOpen={!!commentToDelete}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteComment}
        isDeleting={!!deletingCommentId}
      />
    </div>
  );
};
