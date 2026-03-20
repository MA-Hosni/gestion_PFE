export type Priority = 'Lowest' | 'Low' | 'Medium' | 'High' | 'Highest'
export type Status = 'ToDo' | 'InProgress' | 'Standby' | 'Done'
export type TaskPriority = 'Low' | 'Medium' | 'High'
export type TaskStatus = 'ToDo' | 'InProgress' | 'Standby' | 'Done'

export interface TaskStatusCounts {
  todo: number
  inProgress: number
  standby: number
  done: number
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
}

export interface UserStory {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  taskCount: number
  storyPoints: number
  priority: Priority
  taskStatuses: TaskStatusCounts
  tasks?: Task[]
}

export interface Sprint {
  id: string
  order: number
  name: string
  startDate: string
  endDate: string
  userStories: UserStory[]
}
