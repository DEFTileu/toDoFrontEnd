import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '../../hooks/useTranslation';
import { CreateTaskData } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import RichTextEditor from '../common/RichTextEditor';

interface TaskFormProps {
  initialData?: Partial<CreateTaskData>;
  onSubmit: (data: CreateTaskData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Create Task',
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CreateTaskData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      deadline: initialData?.deadline ? initialData.deadline.split('T')[0] : '',
      status: initialData?.status || 'todo',
    }
  });
  const { t } = useTranslation();

  const handleFormSubmit = async (data: CreateTaskData) => {
    try {
      const formattedData = {
        ...data,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
      };
      await onSubmit(formattedData);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-3xl mx-auto">
      {/* Title Field */}
      <div className="space-y-2">
        <Input
          label={t('tasks.taskTitle')}
          {...register('title', {
            required: t('tasks.titleRequired'),
            minLength: {
              value: 3,
              message: t('tasks.titleMinLength')
            },
            maxLength: {
              value: 100,
              message: t('tasks.titleMaxLength')
            }
          })}
          error={errors.title?.message}
          placeholder={t('tasks.enterTaskTitle')}
          className="text-lg font-medium w-full"
        />
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {t('tasks.description')}
        </label>
        <div className="min-h-[300px]">
          <RichTextEditor
            content={watch('description') || ''}
            onChange={(content) => setValue('description', content)}
            placeholder={t('tasks.enterTaskDescription')}
            minHeight="250px"
            className="border-gray-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
          />
        </div>
        {errors.description?.message && (
          <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Status and Deadline Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            {t('tasks.status')}
          </label>
          <select
            id="status"
            {...register('status')}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 font-medium transition-all duration-200 hover:border-gray-400"
          >
            <option value="todo">{t('tasks.todo')}</option>
            <option value="in-progress">{t('tasks.inProgress')}</option>
            <option value="done">{t('tasks.done')}</option>
          </select>
        </div>

        <div className="space-y-2">
          <Input
            type="date"
            label={t('tasks.deadline')}
            {...register('deadline')}
            error={errors.deadline?.message}
            min={new Date().toISOString().split('T')[0]}
            className="w-full cursor-pointer"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
          className="px-6 py-2.5"
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          loading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
