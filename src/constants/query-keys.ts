export const QUERY_KEYS = {
  AUTH: {
    USER: ['auth', 'user'],
    SESSION: ['auth', 'session'],
  },
  DASHBOARD: {
    STATS: ['sidebar', 'stats'],
    ACTIVITIES: ['sidebar', 'activities'],
    TEAM_PROGRESS: ['sidebar', 'team-progress'],
    VELOCITY: ['sidebar', 'velocity'],
    BURNDOWN: ['sidebar', 'burndown'],
  },
  WORK_ITEMS: {
    ALL: 'work-items',
    DETAIL: (id: string) => ['work-items', id],
  }
} as const
