export const QUERY_KEYS = {
  AUTH: {
    USER: ['auth', 'user'],
    SESSION: ['auth', 'session'],
  },
  DASHBOARD: {
    STATS: ['dashboard', 'stats'],
    ACTIVITIES: ['dashboard', 'activities'],
    TEAM_PROGRESS: ['dashboard', 'team-progress'],
    VELOCITY: ['dashboard', 'velocity'],
    BURNDOWN: ['dashboard', 'burndown'],
  },
} as const
