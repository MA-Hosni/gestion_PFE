import type { Sprint, UserStory, User, Task } from './types'

export const sprints: Sprint[] = [
  { id: 's1', name: 'Sprint 1: Authentication & Setup' },
  { id: 's2', name: 'Sprint 2: Project Management Core' },
  { id: 's3', name: 'Sprint 3: Task Workflow' },
]

export const userStories: UserStory[] = [
  { id: 'us1', title: 'US-101: User Login', sprintId: 's1' },
  { id: 'us2', title: 'US-102: User Registration', sprintId: 's1' },
  { id: 'us3', title: 'US-201: Create Project', sprintId: 's2' },
  { id: 'us4', title: 'US-202: Add Members', sprintId: 's2' },
  { id: 'us5', title: 'US-301: Drag and Drop Board', sprintId: 's3' },
]

export const users: User[] = [
  { id: 'u1', name: 'Olivia Sparks', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png', initials: 'OS' },
  { id: 'u2', name: 'Howard Lloyd', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png', initials: 'HL' },
  { id: 'u3', name: 'Hallie Richards', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png', initials: 'HR' },
]

export const initialTasks: Task[] = [
  {
    id: 'T-101',
    title: 'Design Login Page UI',
    description: 'Create the layout for the login page using shadcn/ui components.',
    status: 'Done',
    priority: 'High',
    sprintId: 's1',
    userStoryId: 'us1',
    assigneeId: 'u1',
    dueDate: new Date(2024, 10, 15),
    commentsCount: 3,
    attachmentsCount: 1,
  },
  {
    id: 'T-102',
    title: 'Implement Authentication API jezjejzf jfzjfjrf jkkdkdkrj',
    description: 'Connect the frontend login form to the backend auth endpoints.',
    status: 'Done',
    priority: 'High',
    sprintId: 's1',
    userStoryId: 'us1',
    assigneeId: 'u2',
    dueDate: new Date(2024, 10, 16),
    commentsCount: 5,
    attachmentsCount: 0,
  },
  {
    id: 'T-201',
    title: 'Create Project Modal',
    description: 'Implement the modal for creating a new project with title and Implement the modal for creating a new project with title and description.',
    status: 'InProgress',
    priority: 'Medium',
    sprintId: 's2',
    userStoryId: 'us3',
    assigneeId: 'u1',
    dueDate: new Date(2024, 10, 20),
    commentsCount: 1,
    attachmentsCount: 2,
  },
  {
    id: 'T-202',
    title: 'Project List View',
    description: 'Display a grid of projects with search and filtering.',
    status: 'ToDo',
    priority: 'Medium',
    sprintId: 's2',
    userStoryId: 'us3',
    assigneeId: 'u3',
    dueDate: new Date(2024, 10, 22),
    commentsCount: 0,
    attachmentsCount: 0,
  },
   {
    id: 'T-301',
    title: 'Kanban Board Setup',
    description: 'Initialize the board structure with columns.',
    status: 'Standby',
    priority: 'Low',
    sprintId: 's3',
    userStoryId: 'us5',
    assigneeId: 'u2',
    dueDate: new Date(2024, 11, 5),
    commentsCount: 2,
    attachmentsCount: 1,
  },
]
