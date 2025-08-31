import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useTranslation } from '../../hooks/useTranslation';

interface DeleteCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteCommentModal: React.FC<DeleteCommentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="relative">
        {/* Красивый заголовок с иконкой */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('comments.deleteTitle')}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {t('comments.deleteMessage')}
              </p>
            </div>
          </div>

          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            disabled={isDeleting}
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Предупреждающий блок */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Trash2 className="w-5 h-5 text-red-500 mt-0.5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 mb-1">
                {t('comments.deleteConfirm')}
              </h4>
              <p className="text-sm text-red-700">
                {t('comments.deleteMessage')}
              </p>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-end space-x-3">
          <Button
            onClick={onClose}
            variant="secondary"
            size="sm"
            disabled={isDeleting}
            className="min-w-[100px]"
          >
            {t('comments.keepComment')}
          </Button>

          <Button
            onClick={onConfirm}
            variant="danger"
            size="sm"
            loading={isDeleting}
            disabled={isDeleting}
            className="min-w-[120px] bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            {isDeleting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Удаление...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>{t('comments.deleteButton')}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
