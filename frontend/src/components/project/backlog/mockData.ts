import type { Sprint } from './types'

export const mockSprints: Sprint[] = [
  {
    id: 's1',
    order: 1,
    name: 'Authentication & Setup',
    startDate: '01/10/2024',
    endDate: '15/10/2024',
    userStories: [
      {
        id: 'us1',
        title: 'US-101: User Login & JWT',
        startDate: '01/10/2024',
        endDate: '05/10/2024',
        taskCount: 3,
        storyPoints: 0,
        priority: 'High',
        taskStatuses: { todo: 0, inProgress: 1, standby: 0, done: 2 }
      },
      {
        id: 'us2',
        title: 'US-102: User Registration',
        startDate: '06/10/2024',
        endDate: '10/10/2024',
        taskCount: 5,
        storyPoints: 0,
        priority: 'Medium',
        taskStatuses: { todo: 3, inProgress: 2, standby: 0, done: 0 }
      }
    ]
  },
  {
    id: 's2',
    order: 2,
    name: 'Project Management Core',
    startDate: '16/10/2024',
    endDate: '31/10/2024',
    userStories: [
      {
        id: 'us3',
        title: 'US-201: Manage Workspaces',
        startDate: '16/10/2024',
        endDate: '20/10/2024',
        taskCount: 4,
        storyPoints: 4,
        priority: 'Low',
        taskStatuses: { todo: 4, inProgress: 0, standby: 0, done: 0 }
      }
    ]
  },
  {
    id: 's3',
    order: 3,
    name: 'Kanban Board Logic (Empty Sprint)',
    startDate: '01/11/2024',
    endDate: '15/11/2024',
    userStories: []
  },
  {
    id: 's4',
    order: 4,
    name: 'Kanban Board Logic (Empty Sprint)',
    startDate: '01/11/2024',
    endDate: '15/11/2024',
    userStories: []
  },
  {
    id: 's5',
    order: 5,
    name: 'Kanban Board Logic (Empty Sprint)',
    startDate: '01/11/2024',
    endDate: '15/11/2024',
    userStories: []
  },
]
