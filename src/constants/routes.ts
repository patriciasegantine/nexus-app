export const AppRoutes = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  DASHBOARD: {
    HOME: '/dashboard',
    BOARD: '/dashboard/board',
    BACKLOG: '/dashboard/backlog',
    PROFILE: '/dashboard/profile',
    SETTINGS: '/dashboard/settings',
  },
} as const
