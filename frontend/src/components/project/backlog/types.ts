export type Priority = 'Low' | 'Medium' | 'High'
export type Status = 'ToDo' | 'InProgress' | 'Standby' | 'Done'

export interface TaskStatusCounts {
  todo: number
  inProgress: number
  standby: number
  done: number
}

export interface UserStory {
  id: string
  title: string
  startDate: string
  endDate: string
  taskCount: number
  priority: Priority
  taskStatuses: TaskStatusCounts
}

export interface Sprint {
  id: string
  order: number
  name: string
  startDate: string
  endDate: string
  userStories: UserStory[]
}
