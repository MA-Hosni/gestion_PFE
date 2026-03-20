import type { TaskStatus } from '../types'

export interface StatusChange {
  id: string
  taskId: string
  from: TaskStatus
  to: TaskStatus
  changedBy: string
  changedAt: string // ISO string
}

// Mock history keyed by task id
export const mockTaskHistory: Record<string, StatusChange[]> = {
  'task-1': [
    { id: 'h1', taskId: 'task-1', from: 'ToDo',       to: 'InProgress', changedBy: 'Alice Martin', changedAt: '2024-10-01T09:00:00Z' },
    { id: 'h2', taskId: 'task-1', from: 'InProgress', to: 'Done',       changedBy: 'Alice Martin', changedAt: '2024-10-03T14:30:00Z' },
  ],
  'task-2': [
    { id: 'h3', taskId: 'task-2', from: 'ToDo',       to: 'InProgress', changedBy: 'Bob Smith',   changedAt: '2024-10-05T10:15:00Z' },
  ],
  'task-3': [
    { id: 'h4', taskId: 'task-3', from: 'ToDo',       to: 'Standby',    changedBy: 'Alice Martin', changedAt: '2024-10-06T08:00:00Z' },
    { id: 'h5', taskId: 'task-3', from: 'Standby',    to: 'InProgress', changedBy: 'Alice Martin', changedAt: '2024-10-07T11:45:00Z' },
  ],
  'task-4': [],
  'task-5': [
    { id: 'h6', taskId: 'task-5', from: 'ToDo',       to: 'Standby',    changedBy: 'Bob Smith',   changedAt: '2024-10-08T16:00:00Z' },
  ],
}
