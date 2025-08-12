import { TranslationKeys } from './en';

export const ru: TranslationKeys = {
  // Navigation
  nav: {
    myTasks: 'Мои Задачи',
    sprints: 'Спринты',
    apiDocs: 'API Документация',
    profileSettings: 'Настройки Профиля',
    logout: 'Выйти',
    language: 'Язык',
  },

  // Authentication
  auth: {
    welcomeBack: 'Добро пожаловать',
    signInToAccount: 'Войдите в свой аккаунт',
    createAccount: 'Создайте аккаунт',
    joinTaskFlow: 'Присоединяйтесь к TaskFlow сегодня',
    signIn: 'Войти',
    signUp: 'Регистрация',
    createAccountBtn: 'Создать Аккаунт',
    emailAddress: 'Email адрес',
    password: 'Пароль',
    confirmPassword: 'Подтвердите Пароль',
    fullName: 'Полное Имя',
    enterEmail: 'Введите ваш email',
    enterPassword: 'Введите ваш пароль',
    createPassword: 'Создайте пароль',
    confirmPasswordPlaceholder: 'Подтвердите ваш пароль',
    enterFullName: 'Введите ваше полное имя',
    dontHaveAccount: 'Нет аккаунта?',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    demoCredentials: 'Демо данные:',
    email: 'Email:',
    
    // Validation messages
    emailRequired: 'Email обязателен',
    invalidEmail: 'Неверный email адрес',
    passwordRequired: 'Пароль обязателен',
    passwordMinLength: 'Пароль должен содержать минимум 6 символов',
    nameRequired: 'Имя обязательно',
    nameMinLength: 'Имя должно содержать минимум 2 символа',
    confirmPasswordRequired: 'Пожалуйста, подтвердите пароль',
    passwordsNotMatch: 'Пароли не совпадают',

    // Email verification
    emailVerification: 'Подтверждение Email',
    verifyYourEmail: 'Подтвердите ваш email',
    verificationEmailSent: 'Мы отправили письмо с подтверждением на:',
    checkEmailInstructions: 'Пожалуйста, проверьте вашу почту и нажмите на ссылку в письме для активации аккаунта.',
    continueToApp: 'Продолжить в приложение',
    didntReceiveEmail: 'Не получили письмо?',
    resendEmail: 'Отправить повторно',
  },

  // Tasks
  tasks: {
    taskBoard: 'Доска Задач',
    newTask: 'Новая Задача',
    createNewTask: 'Создать Новую Задачу',
    addNewTask: 'Добавьте новую задачу в ваш список дел',
    backToTasks: 'Назад к Задачам',
    editTask: 'Редактировать Задачу',
    taskTitle: 'Название Задачи',
    description: 'Описание',
    deadline: 'Срок (Необязательно)',
    status: 'Статус',
    enterTaskTitle: 'Введите название задачи...',
    enterTaskDescription: 'Введите описание задачи...',
    cancel: 'Отмена',
    createTask: 'Создать Задачу',
    updateTask: 'Обновить Задачу',
    saveChanges: 'Сохранить Изменения',
    
    // Task statuses
    todo: 'К Выполнению',
    inProgress: 'В Процессе',
    done: 'Выполнено',
    
    // Task actions
    editTaskAction: 'Редактировать задачу',
    deleteTask: 'Удалить задачу',
    confirmDelete: 'Вы уверены, что хотите удалить эту задачу?',
    
    // Task stats
    noTasksYet: 'Пока нет задач',
    tasksWaitingToStart: 'Задачи ожидающие начала',
    currentlyWorkingOn: 'В работе',
    successfullyFinished: 'Успешно завершено',
    dropTasksHere: 'Перетащите задачи сюда',
    
    // Messages
    taskCreatedSuccess: 'Задача успешно создана!',
    taskUpdatedSuccess: 'Задача успешно обновлена',
    taskDeletedSuccess: 'Задача успешно удалена',
    taskMovedTo: 'Задача перемещена в',
    failedToCreateTask: 'Не удалось создать задачу',
    failedToUpdateTask: 'Не удалось обновить задачу',
    failedToDeleteTask: 'Не удалось удалить задачу',
    failedToUpdateStatus: 'Не удалось обновить статус задачи',
    
    // Validation
    titleRequired: 'Название обязательно',
    titleMinLength: 'Название должно содержать минимум 3 символа',
    titleMaxLength: 'Название должно содержать менее 100 символов',
    descriptionMaxLength: 'Описание должно содержать менее 500 символов',
  },

  // Profile
  profile: {
    profileDashboard: 'Панель Профиля',
    manageAccount: 'Управляйте аккаунтом и отслеживайте продуктивность',
    editProfile: 'Редактировать Профиль',
    profilePicture: 'Фото Профиля',
    personalInformation: 'Личная Информация',
    memberSince: 'Участник с',
    productivityStats: 'Статистика Продуктивности',
    completionRate: 'Процент Выполнения',
    currentStreak: 'Текущая Серия',
    bestStreak: 'Лучшая Серия',
    quickActions: 'Быстрые Действия',
    accountSettings: 'Настройки Аккаунта',
    preferences: 'Предпочтения',
    achievements: 'Достижения',
    taskOverview: 'Обзор Задач',
    totalTasks: 'Всего Задач',
    progressBreakdown: 'Разбивка Прогресса',
    overallProgress: 'Общий Прогресс',
    toDoTasks: 'Задачи К Выполнению',
    accountSecurity: 'Безопасность Аккаунта',
    changePassword: 'Изменить',
    twoFactorAuth: 'Двухфакторная аутентификация',
    notEnabled: 'Не включена',
    notifications: 'Уведомления',
    emailNotifications: 'Email уведомления',
    taskReminders: 'Напоминания о задачах',
    
    // Avatar upload
    uploadAvatar: 'Загрузить',
    cancelUpload: 'Отмена',
    changeAvatar: 'Изменить Аватар',
    supportedFormats: 'Поддерживаемые форматы: JPG, PNG, GIF. Макс. размер: 5МБ',
    
    // Messages
    profileUpdatedSuccess: 'Профиль успешно обновлен!',
    avatarUpdatedSuccess: 'Аватар успешно обновлен!',
    failedToUpdateProfile: 'Не удалось обновить профиль',
    failedToUploadAvatar: 'Не удалось загрузить аватар',
  },

  // Common
  common: {
    loading: 'Загрузка...',
    loadingTasks: 'Загрузка задач...',
    tryAgain: 'Попробовать Снова',
    serverBusy: 'Сервер Занят',
    errorLoadingTasks: 'Ошибка Загрузки Задач',
    welcomeMessage: 'Добро пожаловать!',
    accountCreatedSuccess: 'Аккаунт успешно создан!',
    
    // Time formats
    today: 'Сегодня',
    yesterday: 'Вчера',
    todayAt: 'Сегодня в',
    yesterdayAt: 'Вчера в',
    dueToday: 'Срок сегодня',
    overdue: 'Просрочено',
    
    // Buttons
    showPassword: 'Показать пароль',
    hidePassword: 'Скрыть пароль',
    closeModal: 'Закрыть модальное окно',
    closeNotification: 'Закрыть уведомление',
    cancel: 'Отмена',
  },

  // API Documentation
  api: {
    title: 'API Документация',
    subtitle: 'Полная справка по backend API для приложения TaskFlow',
    baseUrl: 'Базовый URL',
    authentication: 'Аутентификация',
    dataModels: 'Модели Данных',
    userObject: 'Объект Пользователя',
    taskObject: 'Объект Задачи',
    requestBody: 'Тело Запроса',
    successResponse: 'Успешный Ответ',
    errorResponses: 'Ответы с Ошибками',
    implementationGuidelines: 'Руководство по Реализации',
    generalRequirements: 'Общие Требования',
    securityPerformance: 'Безопасность и Производительность',
  },
};