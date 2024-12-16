export const AppRoutes = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  DASHBOARD: {
    HOME: '/',
    WORK_ITEMS: '/work-items',
    BOARD: '/board',
    PROFILE: '/profile',
    SETTINGS: '/settings',
  },
} as const
