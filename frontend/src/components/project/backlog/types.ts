export type Priority = 'lowest' | 'low' | 'medium' | 'high' | 'highest'
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
  userStoryId: string
  assignedTo?: string
}

export interface UserStory {
  id: string
  storyName: string
  description?: string
  startDate: string
  dueDate: string
  taskCount: number
  storyPointEstimate: number
  priority: Priority
  taskStatuses: TaskStatusCounts
  tasks?: Task[]
}

export interface Sprint {
  id: string
  orderIndex: number
  title: string
  goal?: string
  startDate: string
  endDate: string
  userStories: UserStory[]
}
