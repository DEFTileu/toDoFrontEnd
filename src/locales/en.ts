export const en = {
  // Navigation
  nav: {
    myTasks: 'My Tasks',
    sprints: 'Sprints',
    apiDocs: 'API Docs',
    profileSettings: 'Profile Settings',
    logout: 'Logout',
    language: 'Language',
  },

  // Authentication
  auth: {
    welcomeBack: 'Welcome back',
    signInToAccount: 'Sign in to your account',
    createAccount: 'Create your account',
    joinTaskFlow: 'Join TaskFlow today',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    createAccountBtn: 'Create Account',
    emailAddress: 'Email address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    createPassword: 'Create a password',
    confirmPasswordPlaceholder: 'Confirm your password',
    enterFullName: 'Enter your full name',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    demoCredentials: 'Demo credentials:',
    email: 'Email:',
    
    // Validation messages
    emailRequired: 'Email is required',
    invalidEmail: 'Invalid email address',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters',
    nameRequired: 'Name is required',
    nameMinLength: 'Name must be at least 2 characters',
    confirmPasswordRequired: 'Please confirm your password',
    passwordsNotMatch: 'Passwords do not match',

    emailVerification: {
      emailVerification: 'Email Verification',
      verifyYourEmail: 'Verify your email',
      verificationEmailSent: 'We sent a verification email to:',
      checkEmailInstructions: 'Please check your email and click the link in the message to activate your account.',
      continueToApp: 'Continue to App',
      didntReceiveEmail: "Didn't receive the email?",
      resendEmail: 'Resend email',

      // Новое
      title: 'Verify Your Email',
      subtitle: 'Check Your Email',
      message: "We've sent a verification code to",
      inputLabel: 'Verification Code',
      inputPlaceholder: 'Enter 6-digit code',
      inputError: {
        required: 'Verification code is required',
        invalid: 'Please enter a valid 6-digit code',
      },
      resendPrompt: "Didn't receive the code?",
      resendButton: 'Resend Code',
      resendCountdown: 'Resend in {{count}}s',
      cancel: 'Cancel',
      verify: 'Verify Email',
      success: 'Email verified successfully!',
      failed: 'Verification failed',
      resendSuccess: 'Verification code sent!',
      resendFailed: 'Failed to resend code',
      securityNoteTitle: 'Security Note:',
      securityNote: "The verification code will expire in 10 minutes. If you don't see the email, check your spam folder.",
      checkEmail: 'Check your email',
      sentCode: 'We have sent a verification code to:',
      verificationCode: 'Verification Code',
      codeRequired: 'Enter verification code',
      invalidCode: 'Invalid code format',
      codePlaceholder: 'Enter 6-digit code',
      didNotReceive: "Haven't received the code?",
      resendIn: 'Resend in {{count}}s',
      resendCode: 'Resend Code',
      verifyEmail: 'Verify',
      codeSent: 'Verification code sent!',
    },

  },

  // Tasks
  tasks: {
    taskBoard: 'Task Board',
    newTask: 'New Task',
    createNewTask: 'Create New Task',
    addNewTask: 'Add a new task to your todo list',
    backToTasks: 'Back to Tasks',
    editTask: 'Edit Task',
    taskTitle: 'Task Title',
    description: 'Description',
    deadline: 'Deadline (Optional)',
    status: 'Status',
    enterTaskTitle: 'Enter task title...',
    enterTaskDescription: 'Enter task description...',
    cancel: 'Cancel',
    createTask: 'Create Task',
    updateTask: 'Update Task',
    saveChanges: 'Save Changes',
    
    // Task statuses
    todo: 'To Do',
    inProgress: 'In Progress',
    done: 'Done',
    
    // Task actions
    editTaskAction: 'Edit task',
    deleteTask: 'Delete task',
    confirmDelete: 'Are you sure you want to delete this task?',
    
    // Task stats
    noTasksYet: 'No tasks yet',
    tasksWaitingToStart: 'Tasks waiting to start',
    currentlyWorkingOn: 'Currently working on',
    successfullyFinished: 'Successfully finished',
    dropTasksHere: 'Drop tasks here',
    
    // Messages
    taskCreatedSuccess: 'Task created successfully!',
    taskUpdatedSuccess: 'Task updated successfully',
    taskDeletedSuccess: 'Task deleted successfully',
    taskMovedTo: 'Task moved to',
    failedToCreateTask: 'Failed to create task',
    failedToUpdateTask: 'Failed to update task',
    failedToDeleteTask: 'Failed to delete task',
    failedToUpdateStatus: 'Failed to update task status',
    
    // Validation
    titleRequired: 'Title is required',
    titleMinLength: 'Title must be at least 3 characters',
    titleMaxLength: 'Title must be less than 100 characters',
    descriptionMaxLength: 'Description must be less than 500 characters',

    // Preview modal additions
    loadingDetails: 'Loading task details...',
    createdLabel: 'Created',
    lastUpdated: 'Last Updated',
    edit: 'Edit',
    delete: 'Delete',
    descriptionSection: 'Description',
    doubleClickToEdit: 'Double-click to edit',
    clickTwiceToShow: 'Click twice to show description',
    clickTwiceToShowComments: 'Click twice to show comments',
    statusUpdatedSuccess: 'Status updated successfully!',
    descriptionUpdatedSuccess: 'Description updated successfully!',
    failedToLoadDetails: 'Failed to load task details',
    failedToUpdateDescription: 'Failed to update description',
    notFound: 'Task not found',
    notFoundMessage: 'The requested task could not be loaded.',
    properties: 'Properties',
    sprint: 'Sprint',
    active: 'Active',
    completed: 'Completed',
  },

  // Comments
  comments: {
    noComments: 'No comments yet. Be the first to add one!',
    writePlaceholder: 'Write a comment...',
    post: 'Post Comment',
    addSuccess: 'Comment added successfully',
    addError: 'Failed to add comment',
    title: 'Comments',
    addLabel: 'Add a comment',
    placeholderRich: 'Write your comment here... You can use **bold**, *italic*, and lists!',
    formattingTips: 'Formatting tips:',
    formattingExamples: 'Use **bold**, *italic*, - bullet lists, 1. numbered lists',
    count: '{{count}} comments',
  },

  // Profile
  profile: {
    profileDashboard: 'Profile Dashboard',
    manageAccount: 'Manage your account and track your productivity',
    editProfile: 'Edit Profile',
    profilePicture: 'Profile Picture',
    personalInformation: 'Personal Information',
    memberSince: 'Member since',
    productivityStats: 'Productivity Stats',
    completionRate: 'Completion Rate',
    currentStreak: 'Current Streak',
    bestStreak: 'Best Streak',
    quickActions: 'Quick Actions',
    accountSettings: 'Account Settings',
    preferences: 'Preferences',
    achievements: 'Achievements',
    taskOverview: 'Task Overview',
    totalTasks: 'Total Tasks',
    progressBreakdown: 'Progress Breakdown',
    overallProgress: 'Overall Progress',
    toDoTasks: 'To Do Tasks',
    accountSecurity: 'Account Security',
    changePassword: 'Change',
    twoFactorAuth: 'Two-factor auth',
    notEnabled: 'Not enabled',
    notifications: 'Notifications',
    emailNotifications: 'Email notifications',
    taskReminders: 'Task reminders',
    
    // Avatar upload
    uploadAvatar: 'Upload',
    cancelUpload: 'Cancel',
    changeAvatar: 'Change Avatar',
    supportedFormats: 'Supported formats: JPG, PNG, GIF. Max size: 5MB',
    
    // Messages
    profileUpdatedSuccess: 'Profile updated successfully!',
    avatarUpdatedSuccess: 'Avatar updated successfully!',
    failedToUpdateProfile: 'Failed to update profile',
    failedToUploadAvatar: 'Failed to upload avatar',
  },

  // Common
  common: {
    loading: 'Loading...',
    loadingTasks: 'Loading tasks...',
    tryAgain: 'Try Again',
    serverBusy: 'Server is Busy',
    errorLoadingTasks: 'Error Loading Tasks',
    welcomeMessage: 'Welcome back!',
    accountCreatedSuccess: 'Account created successfully!',

    // Time formats
    today: 'Today',
    yesterday: 'Yesterday',
    todayAt: 'Today at',
    yesterdayAt: 'Yesterday at',
    dueToday: 'Due today',
    overdue: 'Overdue',

    // Buttons
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    closeModal: 'Close modal',
    closeNotification: 'Close notification',
    cancel: 'Cancel',
    save: 'Save',
  },
  passwordChange: {
    title: 'Change Password',
    description: 'To change your password, please enter your current password and a new password.',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    currentPasswordRequired: 'Current password is required',
    newPasswordRequired: 'New password is required',
    confirmPasswordRequired: 'Please confirm your new password',
    passwordMinLength: 'Password must be at least 8 characters',
    passwordPattern: 'Password must contain uppercase, lowercase letters and numbers',
    passwordsDoNotMatch: 'Passwords do not match',
    currentPasswordPlaceholder: 'Enter your current password',
    newPasswordPlaceholder: 'Enter new password',
    confirmPasswordPlaceholder: 'Confirm new password',
    passwordRequirements: 'Password Requirements',
    requirementMinLength: 'Minimum 8 characters',
    requirementUppercase: 'At least one uppercase letter',
    requirementLowercase: 'At least one lowercase letter',
    requirementNumber: 'At least one number',
    changePassword: 'Change Password',
    success: 'Password changed successfully',
    error: 'Failed to change password'
  },

  // API Documentation
  api: {
    title: 'API Documentation',
    subtitle: 'Complete backend API reference for TaskFlow application',
    baseUrl: 'Base URL',
    authentication: 'Authentication',
    dataModels: 'Data Models',
    userObject: 'User Object',
    taskObject: 'Task Object',
    requestBody: 'Request Body',
    successResponse: 'Success Response',
    errorResponses: 'Error Responses',
    implementationGuidelines: 'Implementation Guidelines',
    generalRequirements: 'General Requirements',
    securityPerformance: 'Security & Performance',
  },

  // Sprints
  sprints: {
    manageAndReview: 'Manage and review your project sprints',
    allSprints: 'All Sprints',
    selectSprint: 'Select a Sprint',
    chooseSprint: 'Choose a sprint from the list to view its tasks and details',
    active: 'Active',
    activeSprint: 'Active Sprint',
    editSprint: 'Edit Sprint',
    sprintName: 'Sprint Name',
    sprintGoal: 'Sprint Goal',
  },

  // Notifications
  notifications: {
    types: {
      TASK: '📋 Task',
      SPRINT: '🏃 Sprint',
      SYSTEM: '⚙️ System'
    }
  },
} as const;

export type TranslationKeys = typeof en;
