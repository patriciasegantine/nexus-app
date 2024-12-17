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
      },
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
        id: 't-2',
        title: 'Add email format validation',
        status: 'DONE',
        workItemId: '2',
        description: 'Check for valid email format during login.',
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
  },
  {
    id: '3',
    title: 'Add dark mode support',
    description: 'Implement dark mode for the user interface',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    tags: ['UI', 'Feature'],
    dueDate: new Date().toISOString(),
    tasks: [
      {
        id: 't-3',
        title: 'Create dark mode toggle',
        status: 'DONE',
        workItemId: '3',
        description: 'Allow users to toggle between light and dark modes.',
      },
    ],
    type: 'FEATURE',
    assignee: {
      id: '3',
      name: 'Emily Brown',
      email: 'emily@example.com',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Refactor API endpoints',
    description: 'Improve performance of existing API endpoints',
    status: 'DONE',
    priority: 'LOW',
    tags: ['Refactor', 'Backend'],
    dueDate: new Date().toISOString(),
    tasks: [
      {
        id: 't-4',
        title: 'Optimise user data retrieval',
        status: 'DONE',
        workItemId: '4',
        description: 'Reduce response time for user data requests.',
      },
    ],
    type: 'IDEA',
    assignee: {
      id: '4',
      name: 'Michael Green',
      email: 'michael@example.com',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Add user profile page',
    description: 'Create a profile page for users to manage their information',
    status: 'TODO',
    priority: 'HIGH',
    tags: ['Profile', 'Feature'],
    dueDate: new Date().toISOString(),
    tasks: [
      {
        id: 't-5',
        title: 'Design profile page layout',
        status: 'DONE',
        workItemId: '5',
        description: 'Create the layout and UI for the user profile page.',
      },
    ],
    type: 'FEATURE',
    assignee: {
      id: '5',
      name: 'Sophia Wilson',
      email: 'sophia@example.com',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
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
