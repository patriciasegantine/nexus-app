import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { WorkItem } from "@/types/work-item";

const mockWorkItems: WorkItem[] = [
  {
    id: '1',
    title: 'Implement authentication',
    description: 'Add user authentication using NextAuth.js',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    tags: ['Authentication', 'Security'],
    dueDate: new Date().toISOString(),
    tasks: [
      {
        id: 't-1',
        title: 'Setup NextAuth Provider',
        status: 'DONE',
        workItemId: '1',
        description: 'Integrate NextAuth.js and configure providers.',
        assignee: {
          name: 'Patricia',
          avatar: 'http:'
        },
        priority: "HIGH"
      }
    ],
    type: 'FEATURE',
    assignee: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Fix login form validation',
    description: 'Ensure proper validation for login inputs',
    status: 'TODO',
    priority: 'MEDIUM',
    tags: ['Bug', 'Validation'],
    dueDate: new Date().toISOString(),
    tasks: [
      {
        id: 't-3',
        title: 'Add email format validation',
        status: 'DONE',
        workItemId: '2',
        description: 'Check for valid email format during login.',
        assignee: {
          name: 'Patricia',
          avatar: 'http:'
        },
        priority: "MEDIUM"
      },
      {
        id: 't-4',
        title: 'Add email format validation',
        status: 'IN_PROGRESS',
        workItemId: '2',
        description: 'Check for valid email format during login.',
        assignee: {
          name: 'Patricia',
          avatar: 'http:'
        },
        priority: "LOW"
      },
    ],
    type: 'BUG',
    assignee: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

export function useWorkItems() {
  return useQuery({
    queryKey: [QUERY_KEYS.WORK_ITEMS.ALL],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      return mockWorkItems;
    }
  })
}
