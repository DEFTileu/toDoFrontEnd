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
    emailVerification: {
      emailVerification: 'Подтверждение почты',
      verifyYourEmail: 'Подтвердите вашу почту',
      verificationEmailSent: 'Мы отправили письмо с подтверждением на:',
      checkEmailInstructions: 'Пожалуйста, проверьте вашу почту и перейдите по ссылке в письме, чтобы активировать аккаунт.',
      continueToApp: 'Перейти в приложение',
      didntReceiveEmail: 'Не получили письмо?',
      resendEmail: 'Отправить письмо повторно',

      // Новое
      title: 'Подтверждение Email',
      subtitle: 'Проверьте вашу почту',
      message: 'Мы отправили код подтверждения на',
      checkEmail: 'Проверьте вашу почту',
      sentCode: 'Мы отправили код подтверждения на указанный адрес:',
      verificationCode: 'Код подтверждения',
      codeRequired: 'Введите код подтверждения',
      invalidCode: 'Неверный формат кода',
      codePlaceholder: 'Введите 6-значный код',
      didNotReceive: 'Не получили код?',
      resendIn: 'Повторная отправка через {{count}}с',
      resendCode: 'Отправить код повторно',
      verifyEmail: 'Подтвердить',
      codeSent: 'Код подтверждения отправлен!',
      success: 'Почта успешно подтверждена!',
      failed: 'Ошибка подтверждения',
      resendSuccess: 'Код подтверждения отправлен!',
      resendFailed: 'Не удалось отправить код',
      securityNoteTitle: 'Примечание по безопасности:',
      securityNote: 'Код подтверждения истекает через 10 минут. Проверьте папку "Спам", если не видите письмо.',
      inputLabel: 'Введите код подтверждения',  // Заполнено
      inputPlaceholder: '6-значный код для подтверждения',  // Заполнено
      inputError: {
        required: 'Код подтверждения обязателен',  // Заполнено
        invalid: 'Пожалуйста, введите правильный 6-значный код',  // Заполнено
      },
      resendPrompt: 'Не получили код?',  // Заполнено
      resendButton: 'Отправить код повторно',  // Заполнено
      resendCountdown: 'Повторная отправка через {{count}}с',  // Заполнено
      cancel: 'Отмена',  // Заполнено
      verify: 'Подтвердить',  // Заполнено
    }

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

    // Preview modal additions
    loadingDetails: 'Загрузка деталей задачи...',
    createdLabel: 'Создано',
    lastUpdated: 'Последнее обновление',
    edit: 'Редактировать',
    delete: 'Удалить',
    descriptionSection: 'Описание',
    doubleClickToEdit: 'Двойной клик для редактирования',
    clickTwiceToShow: 'Нажмите дважды, чтобы показать описание',
    clickTwiceToShowComments: 'Нажмите дважды, чтобы показать комментарии',
    statusUpdatedSuccess: 'Статус успешно обновлен!',
    descriptionUpdatedSuccess: 'Описание успешно обновлено!',
    failedToLoadDetails: 'Не удалось загрузить детали задачи',
    failedToUpdateDescription: 'Не удалось обновить описание',
    notFound: 'Задача не найдена',
    notFoundMessage: 'Запрошенная задача не может быть загружена.',
    properties: 'Свойства',
    sprint: 'Спринт',
    active: 'Активный',
    completed: 'Завершён',
  },

  // Comments
  comments: {
    noComments: 'Нет комментариев. Будьте первым, кто оставит комментарий!',
    writePlaceholder: 'Напишите комментарий...',
    post: 'Отправить',
    addSuccess: 'Комментарий успешно добавлен',
    addError: 'Не удалось добавить комментарий',
    title: 'Комментарии',
    addLabel: 'Добавить комментарий',
    placeholderRich: 'Напишите ваш комментарий... Можно использовать **жирный**, *курсив* и списки!',
    formattingTips: 'Подсказки форматирования:',
    formattingExamples: 'Используйте **жирный**, *курсив*, - маркированные списки, 1. нумерованные списки',
    count: '{{count}} комментариев',
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
    save: 'Сохранить',
  },
  passwordChange: {
    title: 'Изменение пароля',
    description: 'Для изменения пароля, пожалуйста, введите текущий пароль и новый пароль.',
    currentPassword: 'Текущий пароль',
    newPassword: 'Новый пароль',
    confirmPassword: 'Подтвердите новый пароль',
    currentPasswordRequired: 'Введите текущий пароль',
    newPasswordRequired: 'Введите новый пароль',
    confirmPasswordRequired: 'Подтвердите новый пароль',
    passwordMinLength: 'Пароль должен содержать минимум 8 символов',
    passwordPattern: 'Пароль должен содержать заглавные и строчные буквы, и цифры',
    passwordsDoNotMatch: 'Пароли не совпадают',
    currentPasswordPlaceholder: 'Введите ваш текущий пароль',
    newPasswordPlaceholder: 'Введите новый пароль',
    confirmPasswordPlaceholder: 'Подтвердите новый пароль',
    passwordRequirements: 'Требования к паролю',
    requirementMinLength: 'Минимум 8 символов',
    requirementUppercase: 'Хотя бы одна заглавная буква',
    requirementLowercase: 'Хотя бы одна строчная буква',
    requirementNumber: 'Х��тя бы одна цифра',
    changePassword: 'Изменить пароль',
    success: 'Пароль успешно изменен',
    error: 'Не удалось изменить пароль'
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

  // Sprints
  sprints: {
    manageAndReview: 'Управляйте и просматривайте ваши проектные спринты',
    allSprints: 'Все спринты',
    selectSprint: 'Выберите спринт',
    chooseSprint: 'Выберите спринт из списка, чтобы просмотреть его задачи и детали',
    active: 'Активный',
    activeSprint: 'Активный спринт',
    editSprint: 'Редактировать Спринт',
    sprintName: 'Название Спринта',
    sprintGoal: 'Цель Спринта',
  },
};