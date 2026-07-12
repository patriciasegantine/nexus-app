export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Welcome back!",
  REGISTER_SUCCESS: "Account created successfully! Please check your email.",
  FORGOT_PASSWORD: "If an account exists with this email, you will receive password reset instructions.",
  LOGOUT_SUCCESS: "You have been signed out.",
  RESET_PASSWORD_SUCCESS: "Password reset successful. You can now login with your new password.",
  RESET_PASSWORD_FAIL: "Failed to reset password. Please try again.",
  INVALID_CREDENTIALS: "Invalid email or password",
  INVALID_EMAIL: "Please enter a valid email address.",
  USER_ALREADY_EXISTS: "This email is already registered",
  INVALID_RESET_LINK: "This password reset link is invalid or has expired",
  SAME_PASSWORD: "New password must be different from your current password",
} as const

export const ACTION_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
} as const

export const SETTINGS_MESSAGES = {
  PROFILE_UPDATED: "Name updated.",
  PASSWORD_UPDATED: "Password updated.",
  PASSWORD_PROVIDER_UNAVAILABLE: "Password changes are only available for email/password accounts",
  CURRENT_PASSWORD_INCORRECT: "Current password is incorrect",
  ACCOUNT_DELETED: "Account deleted.",
  USER_NOT_FOUND: "User not found",
  DATA_CLEARED: "All data cleared successfully.",
  AVATAR_UPLOAD_FAILED: "Upload failed",
  AVATAR_FILE_REQUIRED: "No file provided",
  AVATAR_FILE_TYPE_INVALID: "File must be a JPEG, PNG, GIF, or WebP image",
  AVATAR_FILE_TOO_LARGE: "File must be under 5MB",
} as const

export const PROJECT_MESSAGES = {
  CREATED: "Project created.",
  UPDATED: "Project updated.",
  DELETED: "Project deleted.",
  NOT_FOUND: "Project not found",
} as const

export const TASK_MESSAGES = {
  CREATED: "Task created.",
  UPDATED: "Task updated.",
  DELETED: "Task deleted.",
  DUPLICATED: "Task duplicated successfully.",
  NOT_FOUND: "Task not found",
} as const

export const TAG_MESSAGES = {
  REQUIRED: "Tag is required",
  ALREADY_ADDED: "Tag already added",
  INVALID: "Tags can only contain letters and numbers, separated by spaces, hyphens or underscores",
  MAX_LENGTH: (maxLength: number) => `Tags must be at most ${maxLength} characters`,
  MAX_COUNT: (maxTags: number) => `Maximum ${maxTags} tags allowed`,
  ADDED: "Tag added.",
} as const

export const DEMO_MESSAGES = {
  UNAVAILABLE: "The demo is temporarily unavailable. Please try again later.",
  SAMPLE_DATA_ADDED: "Sample data added! Feel free to explore.",
  WORKSPACE_ALREADY_HAS_PROJECTS: "Your workspace already has projects",
} as const
