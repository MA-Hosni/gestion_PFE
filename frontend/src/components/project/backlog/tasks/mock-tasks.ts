import type { Task } from '../types'

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Set up authentication module',
    description: 'Implement JWT-based authentication with refresh token support and role-based access control for the entire platform.',
    status: 'Done',
    priority: 'High',
    assignee: 'Alice Martin',
  },
  {
    id: 'task-2',
    title: 'Design database schema for users',
    description: 'Create normalized schema with proper indexing, constraints, and migrations for the user management system.',
    status: 'InProgress',
    priority: 'High',
    assignee: 'Bob Smith',
  },
  {
    id: 'task-3',
    title: 'Build sprint backlog UI',
    description: 'Implement the sprint backlog view with drag-and-drop reordering, expandable user stories, and task management.',
    status: 'InProgress',
    priority: 'Medium',
    assignee: 'Alice Martin',
  },
  {
    id: 'task-4',
    title: 'Write unit tests for API endpoints',
    description: 'Cover all REST endpoints with Jest and Supertest, targeting at least 80% code coverage.',
    status: 'ToDo',
    priority: 'Medium',
    assignee: 'Charlie Doe',
  },
  {
    id: 'task-5',
    title: 'Configure CI/CD pipeline',
    description: 'Set up GitHub Actions workflow for automated testing, building, and deployment to staging and production environments.',
    status: 'Standby',
    priority: 'Low',
    assignee: 'Bob Smith',
  },
]
