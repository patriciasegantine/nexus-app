export enum AppRoutes {
  // General
  HOME = '/',
  
  // Auth Routes
  LOGIN = '/login',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',
  RESET_PASSWORD = '/reset-password',
  
  // Dashboard Routes
  DASHBOARD = '/dashboard',
  PROFILE = '/dashboard/profile',
  SETTINGS = '/dashboard/settings',
  
  // Analytics Routes
  ANALYTICS = '/dashboard/analytics',
  SALES = '/dashboard/analytics/sales',
  CUSTOMERS = '/dashboard/analytics/customers',
  PRODUCTS = '/dashboard/analytics/products',
  
  // Settings Routes
  ACCOUNT_SETTINGS = '/dashboard/settings/account',
  NOTIFICATIONS = '/dashboard/settings/notifications',
  SECURITY = '/dashboard/settings/security',
}
