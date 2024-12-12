export const QUERY_KEYS = {
  AUTH: {
    USER: ['auth', 'user'],
    SESSION: ['auth', 'session'],
  },
  USERS: {
    ALL: ['users'],
    DETAIL: (id: string) => ['users', id],
  },
} as const
