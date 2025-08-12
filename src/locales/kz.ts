import { TranslationKeys } from './en';

export const kz: TranslationKeys = {
  // Navigation
  nav: {
    myTasks: 'Менің Тапсырмаларым',
    sprints: 'Спринттер',
    apiDocs: 'API Құжаттама',
    profileSettings: 'Профиль Баптаулары',
    logout: 'Шығу',
    language: 'Тіл',
  },

  // Authentication
  auth: {
    welcomeBack: 'Қайта келуіңізбен',
    signInToAccount: 'Аккаунтыңызға кіріңіз',
    createAccount: 'Аккаунт жасаңыз',
    joinTaskFlow: 'TaskFlow-ға бүгін қосылыңыз',
    signIn: 'Кіру',
    signUp: 'Тіркелу',
    createAccountBtn: 'Аккаунт Жасау',
    emailAddress: 'Email мекенжайы',
    password: 'Құпия сөз',
    confirmPassword: 'Құпия сөзді растау',
    fullName: 'Толық аты',
    enterEmail: 'Email мекенжайыңызды енгізіңіз',
    enterPassword: 'Құпия сөзіңізді енгізіңіз',
    createPassword: 'Құпия сөз жасаңыз',
    confirmPasswordPlaceholder: 'Құпия сөзіңізді растаңыз',
    enterFullName: 'Толық атыңызды енгізіңіз',
    dontHaveAccount: 'Аккаунтыңыз жоқ па?',
    alreadyHaveAccount: 'Аккаунтыңыз бар ма?',
    demoCredentials: 'Демо деректер:',
    email: 'Email:',
    
    // Validation messages
    emailRequired: 'Email міндетті',
    invalidEmail: 'Жарамсыз email мекенжайы',
    passwordRequired: 'Құпия сөз міндетті',
    passwordMinLength: 'Құпия сөз кемінде 6 таңбадан тұруы керек',
    nameRequired: 'Аты міндетті',
    nameMinLength: 'Аты кемінде 2 таңбадан тұруы керек',
    confirmPasswordRequired: 'Құпия сөзді растаңыз',
    passwordsNotMatch: 'Құпия сөздер сәйкес келмейді',

    // Email verification
    emailVerification: 'Email растау',
    verifyYourEmail: 'Email мекенжайыңызды растаңыз',
    verificationEmailSent: 'Біз растау хабарламасын жібердік:',
    checkEmailInstructions: 'Поштаңызды тексеріп, аккаунтыңызды белсендіру үшін хабарламадағы сілтемені басыңыз.',
    continueToApp: 'Қолданбаға жалғастыру',
    didntReceiveEmail: 'Хабарлама алмадыңыз ба?',
    resendEmail: 'Қайта жіберу',
  },

  // Tasks
  tasks: {
    taskBoard: 'Тапсырма Тақтасы',
    newTask: 'Жаңа Тапсырма',
    createNewTask: 'Жаңа Тапсырма Жасау',
    addNewTask: 'Тапсырмалар тізіміне жаңа тапсырма қосыңыз',
    backToTasks: 'Тапсырмаларға Оралу',
    editTask: 'Тапсырманы Өңдеу',
    taskTitle: 'Тапсырма Атауы',
    description: 'Сипаттама',
    deadline: 'Мерзімі (Міндетті емес)',
    status: 'Күйі',
    enterTaskTitle: 'Тапсырма атауын енгізіңіз...',
    enterTaskDescription: 'Тапсырма сипаттамасын енгізіңіз...',
    cancel: 'Болдырмау',
    createTask: 'Тапсырма Жасау',
    updateTask: 'Тапсырманы Жаңарту',
    saveChanges: 'Өзгерістерді Сақтау',
    
    // Task statuses
    todo: 'Орындауға',
    inProgress: 'Орындалуда',
    done: 'Орындалды',
    
    // Task actions
    editTaskAction: 'Тапсырманы өңдеу',
    deleteTask: 'Тапсырманы жою',
    confirmDelete: 'Бұл тапсырманы жойғыңыз келетініне сенімдісіз бе?',
    
    // Task stats
    noTasksYet: 'Әлі тапсырмалар жоқ',
    tasksWaitingToStart: 'Басталуын күтіп жатқан тапсырмалар',
    currentlyWorkingOn: 'Қазір жұмыс істеп жатыр',
    successfullyFinished: 'Сәтті аяқталды',
    dropTasksHere: 'Тапсырмаларды осында тастаңыз',
    
    // Messages
    taskCreatedSuccess: 'Тапсырма сәтті жасалды!',
    taskUpdatedSuccess: 'Тапсырма сәтті жаңартылды',
    taskDeletedSuccess: 'Тапсырма сәтті жойылды',
    taskMovedTo: 'Тапсырма жылжытылды',
    failedToCreateTask: 'Тапсырманы жасау сәтсіз аяқталды',
    failedToUpdateTask: 'Тапсырманы жаңарту сәтсіз аяқталды',
    failedToDeleteTask: 'Тапсырманы жою сәтсіз аяқталды',
    failedToUpdateStatus: 'Тапсырма күйін жаңарту сәтсіз аяқталды',
    
    // Validation
    titleRequired: 'Атауы міндетті',
    titleMinLength: 'Атауы кемінде 3 таңбадан тұруы керек',
    titleMaxLength: 'Атауы 100 таңбадан аз болуы керек',
    descriptionMaxLength: 'Сипаттама 500 таңбадан аз болуы керек',
  },

  // Profile
  profile: {
    profileDashboard: 'Профиль Панелі',
    manageAccount: 'Аккаунтыңызды басқарыңыз және өнімділікті қадағалаңыз',
    editProfile: 'Профильді Өңдеу',
    profilePicture: 'Профиль Суреті',
    personalInformation: 'Жеке Ақпарат',
    memberSince: 'Мүше болған уақыт',
    productivityStats: 'Өнімділік Статистикасы',
    completionRate: 'Орындау Пайызы',
    currentStreak: 'Ағымдағы Серия',
    bestStreak: 'Ең Жақсы Серия',
    quickActions: 'Жылдам Әрекеттер',
    accountSettings: 'Аккаунт Баптаулары',
    preferences: 'Теңшелімдер',
    achievements: 'Жетістіктер',
    taskOverview: 'Тапсырмалар Шолуы',
    totalTasks: 'Барлық Тапсырмалар',
    progressBreakdown: 'Прогресс Бөлінуі',
    overallProgress: 'Жалпы Прогресс',
    toDoTasks: 'Орындауға Арналған Тапсырмалар',
    accountSecurity: 'Аккаунт Қауіпсіздігі',
    changePassword: 'Өзгерту',
    twoFactorAuth: 'Екі факторлы аутентификация',
    notEnabled: 'Қосылмаған',
    notifications: 'Хабарландырулар',
    emailNotifications: 'Email хабарландырулары',
    taskReminders: 'Тапсырма еске салғыштары',
    
    // Avatar upload
    uploadAvatar: 'Жүктеу',
    cancelUpload: 'Болдырмау',
    changeAvatar: 'Аватарды Өзгерту',
    supportedFormats: 'Қолдау көрсетілетін форматтар: JPG, PNG, GIF. Макс. өлшемі: 5МБ',
    
    // Messages
    profileUpdatedSuccess: 'Профиль сәтті жаңартылды!',
    avatarUpdatedSuccess: 'Аватар сәтті жаңартылды!',
    failedToUpdateProfile: 'Профильді жаңарту сәтсіз аяқталды',
    failedToUploadAvatar: 'Аватарды жүктеу сәтсіз аяқталды',
  },

  // Common
  common: {
    loading: 'Жүктелуде...',
    loadingTasks: 'Тапсырмалар жүктелуде...',
    tryAgain: 'Қайта Көру',
    serverBusy: 'Сервер Бос Емес',
    errorLoadingTasks: 'Тапсырмаларды Жүктеу Қатесі',
    welcomeMessage: 'Қайта келуіңізбен!',
    accountCreatedSuccess: 'Аккаунт сәтті жасалды!',
    
    // Time formats
    today: 'Бүгін',
    yesterday: 'Кеше',
    todayAt: 'Бүгін',
    yesterdayAt: 'Кеше',
    dueToday: 'Бүгін мерзімі',
    overdue: 'Мерзімі өткен',
    
    // Buttons
    showPassword: 'Құпия сөзді көрсету',
    hidePassword: 'Құпия сөзді жасыру',
    closeModal: 'Модальды жабу',
    closeNotification: 'Хабарландыруды жабу',
    cancel: 'Болдырмау',
  },

  // API Documentation
  api: {
    title: 'API Құжаттамасы',
    subtitle: 'TaskFlow қолданбасы үшін толық backend API анықтамасы',
    baseUrl: 'Негізгі URL',
    authentication: 'Аутентификация',
    dataModels: 'Деректер Модельдері',
    userObject: 'Пайдаланушы Объектісі',
    taskObject: 'Тапсырма Объектісі',
    requestBody: 'Сұраныс Денесі',
    successResponse: 'Сәтті Жауап',
    errorResponses: 'Қате Жауаптары',
    implementationGuidelines: 'Іске Асыру Нұсқаулары',
    generalRequirements: 'Жалпы Талаптар',
    securityPerformance: 'Қауіпсіздік пен Өнімділік',
  },
};