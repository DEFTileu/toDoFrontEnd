import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useTasks } from '../../contexts/TasksContext';
import { useToast } from '../../contexts/ToastContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Task } from '../../types';
import { Button } from '../common/Button';
import RichTextEditor from '../common/RichTextEditor';
import { formatDate, getInitials } from '../../utils/formatters';

interface TaskCommentsProps {
  task: Task;
}

export const TaskComments: React.FC<TaskCommentsProps> = ({ task }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment } = useTasks();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(task.id, newComment.trim());
      setNewComment('');
      showToast(t('comments.addSuccess'), 'success');
    } catch (error) {
      showToast(t('comments.addError'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Comments List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {(task.comments?.length ?? 0) === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t('comments.noComments')}</p>
          </div>
        ) : (
          task.comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex-shrink-0">
                {comment.user.avatar ? (
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
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
                  className={`w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium ${comment.user.avatar ? 'hidden' : 'flex'}`}
                >
                  {getInitials(comment.user.name)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {comment.user.name}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                {/* Правильное отображение HTML-контента с форматированием */}
                <div
                  className="prose prose-sm max-w-none text-gray-700 [&_p]:mb-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2 [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmitComment} className="border-t border-gray-200 pt-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('comments.addLabel')}
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
              <RichTextEditor
                content={newComment}
                onChange={setNewComment}
                placeholder={t('comments.placeholderRich')}
                minHeight="120px"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                <strong>{t('comments.formattingTips')}</strong> {t('comments.formattingExamples')}
              </div>
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
      </form>
    </div>
  );
};
