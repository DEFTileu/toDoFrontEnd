import React, { useState, useEffect, useRef } from 'react';
import { User, Settings, Calendar, CheckSquare, Clock, Target, TrendingUp, Edit, Award, Activity, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TasksContext';
import { useToast } from '../contexts/ToastContext';
import { useNotification } from '../contexts/NotificationContext';
import { useTranslation } from '../hooks/useTranslation';
import { Modal } from '../components/common/Modal';
import { ProfileForm } from '../components/profile/ProfileForm';
import { AvatarUpload } from '../components/profile/AvatarUpload';
import { Button } from '../components/common/Button';
import { formatDate, getInitials } from '../utils/formatters';
import { ChangePasswordModal } from '../components/profile/ChangePasswordModal';
import { NotificationToggle } from '../components/common/NotificationToggle';
import PushNotificationToggle from '../components/common/PushNotificationToggle';
import { User as UserType } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, uploadAvatar } = useAuth();
  const { tasks, fetchTasks } = useTasks();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { setPushEnabledState, setEmailEnabledState: setEmailEnabledStateFn, emailEnabled } = useNotification(); // emailEnabled state from NotificationContext
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Инициализация состояния у��едомлений только один раз при загрузке пользователя
  const initNotifsRef = useRef(false);
  useEffect(() => {
    if (user && !initNotifsRef.current) {
      // pushNotification поле удалено – берём только emailNotification
      if ((user as any).emailNotification !== undefined) {
        setEmailEnabledStateFn(user.emailNotification);
      }
      initNotifsRef.current = true;
    }
  }, [user, setPushEnabledState, setEmailEnabledStateFn]);

  if (!user) {
    return null;
  }

  const handleUpdateProfile = async (data: Partial<UserType>) => {
    try {
      await updateProfile(data);
      setIsEditModalOpen(false);
      showToast(t('profile.profileUpdatedSuccess'), 'success');
    } catch (error) {
      showToast(t('profile.failedToUpdateProfile'), 'error');
      throw error;
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setIsUploadingAvatar(true);
    try {
      await uploadAvatar(file);
      showToast(t('profile.avatarUpdatedSuccess'), 'success');
    } catch (error) {
      showToast(t('profile.failedToUploadAvatar'), 'error');
      throw error;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    console.log(`${type} notifications:`, value);
    showToast(`${type} notifications ${value ? 'enabled' : 'disabled'}`, 'success');
  };

  // Task stats
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;

  // Mock streak data
  const currentStreak = 7;
  const longestStreak = 15;

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                {t('profile.profileDashboard')}
              </h1>
              <p className="text-lg text-gray-600">{t('profile.manageAccount')}</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-4 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 h-24"></div>
                  <div className="relative px-8 pb-8">
                    {/* Avatar */}
                    <div className="flex justify-center -mt-12 mb-6">
                      {user.avatar ? (
                          <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                      ) : (
                          <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                            {getInitials(user.name || user.email)}
                          </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                      <p className="text-gray-600 mb-2">{user.email}</p>
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {t('profile.memberSince')} {formatDate(user.createdAt)}
                      </div>
                    </div>

                    {/* Edit Profile Button */}
                    <Button
                        onClick={() => setIsEditModalOpen(true)}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t('profile.editProfile')}
                    </Button>
                  </div>
                </div>

                {/* Productivity Stats */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Activity className="w-6 h-6 mr-3 text-indigo-600" />
                    {t('profile.productivityStats')}
                  </h3>

                  <div className="space-y-6">
                    {/* Completion Rate */}
                    <div className="text-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                      <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        {completionRate}%
                      </div>
                      <div className="text-sm font-medium text-gray-600">{t('profile.completionRate')}</div>
                    </div>

                    {/* Streaks */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="text-2xl font-bold text-green-600 mb-1">{currentStreak}</div>
                        <div className="text-xs text-gray-600">{t('profile.currentStreak')}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                        <div className="text-2xl font-bold text-orange-600 mb-1">{longestStreak}</div>
                        <div className="text-xs text-gray-600">{t('profile.bestStreak')}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-gray-600" />
                    {t('profile.quickActions')}
                  </h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center group">
                      <User className="w-4 h-4 mr-3 text-gray-500 group-hover:text-indigo-600" />
                      <span>{t('profile.accountSettings')}</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center group">
                      <Settings className="w-4 h-4 mr-3 text-gray-500 group-hover:text-indigo-600" />
                      <span>{t('profile.preferences')}</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center group">
                      <Award className="w-4 h-4 mr-3 text-gray-500 group-hover:text-indigo-600" />
                      <span>{t('profile.achievements')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Task Statistics */}
              <div className="lg:col-span-8 space-y-6">
                {/* Task Overview */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                      <TrendingUp className="w-7 h-7 mr-3 text-indigo-600" />
                      {t('profile.taskOverview')}
                    </h3>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">{totalTasks}</div>
                      <div className="text-sm text-gray-500">{t('profile.totalTasks')}</div>
                    </div>
                  </div>

                  {/* Task Status Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <div className="text-3xl font-bold text-blue-600">{todoTasks.length}</div>
                      </div>
                      <h4 className="text-lg font-semibold text-blue-900 mb-1">{t('tasks.todo')}</h4>
                      <p className="text-sm text-blue-700">{t('tasks.tasksWaitingToStart')}</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-yellow-600">{inProgressTasks.length}</div>
                      </div>
                      <h4 className="text-lg font-semibold text-yellow-900 mb-1">{t('tasks.inProgress')}</h4>
                      <p className="text-sm text-yellow-700">{t('tasks.currentlyWorkingOn')}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <CheckSquare className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-green-600">{doneTasks.length}</div>
                      </div>
                      <h4 className="text-lg font-semibold text-green-900 mb-1">{t('tasks.done')}</h4>
                      <p className="text-sm text-green-700">{t('tasks.successfullyFinished')}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Chart */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-indigo-600" />
                    {t('profile.progressBreakdown')}
                  </h3>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{t('profile.overallProgress')}</span>
                      <span>{completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                        <span className="font-medium text-gray-700">{t('profile.toDoTasks')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-blue-600">{todoTasks.length}</span>
                        <span className="text-sm text-gray-500">
                        ({totalTasks > 0 ? Math.round((todoTasks.length / totalTasks) * 100) : 0}%)
                      </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-yellow-600 mr-3" />
                        <span className="font-medium text-gray-700">{t('tasks.inProgress')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-yellow-600">{inProgressTasks.length}</span>
                        <span className="text-sm text-gray-500">
                        ({totalTasks > 0 ? Math.round((inProgressTasks.length / totalTasks) * 100) : 0}%)
                      </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center">
                        <CheckSquare className="w-4 h-4 text-green-600 mr-3" />
                        <span className="font-medium text-gray-700">{t('tasks.done')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-green-600">{doneTasks.length}</span>
                        <span className="text-sm text-gray-500">({completionRate}%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Cards */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-indigo-600" />
                      {t('profile.accountSecurity')}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-700">{t('auth.password')}</span>
                        <Button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-1 rounded-lg text-sm"
                        >
                          {t('profile.changePassword')}
                        </Button>

                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-700">{t('profile.twoFactorAuth')}</span>
                        <span className="text-sm text-gray-400">{t('profile.notEnabled')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-indigo-600" />
                      {t('profile.notifications')}
                    </h4>
                    <div className="space-y-3">
                      <NotificationToggle
                          id="email-notifications"
                          label={t('profile.emailNotifications')}
                          description="Получать обновления по электронной почте о задачах и проектах"
                          initialValue={emailEnabled}
                          onChange={(value) => handleNotificationChange('Email', value)}
                          type="email"
                      />
                      <PushNotificationToggle className="mt-3" />
                      <NotificationToggle
                          id="task-reminders"
                          label={t('profile.taskReminders')}
                          description="Получать напоминания о предстоящих сроках задач"
                          initialValue={false}
                          onChange={(value) => handleNotificationChange('Task reminder', value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title={t('profile.editProfile')}
            size="lg"
        >
          <div className="space-y-8">
            {/* Avatar Upload Section */}
            <div className="text-center border-b border-gray-200 pb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">{t('profile.profilePicture')}</h4>
              <AvatarUpload
                  currentAvatar={user.avatar}
                  userName={user.name}
                  onUpload={handleAvatarUpload}
                  isUploading={isUploadingAvatar}
              />
            </div>

            {/* Profile Form Section */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">{t('profile.personalInformation')}</h4>
              <ProfileForm
                  user={user}
                  onSubmit={handleUpdateProfile}
              />
            </div>
          </div>
        </Modal>

        {/* Change Password Modal */}
        <ChangePasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
        />
      </div>
  );
};
