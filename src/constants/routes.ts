export const AppRoutes = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  DASHBOARD: {
    HOME: '/',
    PROJECTS: '/projects',
    TASKS: '/tasks',
    SETTINGS: '/settings',
    SETTINGS_PROFILE: '/settings#profile',
  },
  ABOUT: '/about',
} as const
