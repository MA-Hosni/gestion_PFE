export type Priority = 'Low' | 'Medium' | 'High'
export type Status = 'ToDo' | 'InProgress' | 'Standby' | 'Done'

export interface Task {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  sprintId: string
  userStoryId: string
  assigneeId: string
  dueDate?: Date
  commentsCount: number
  attachmentsCount: number
}

export interface User {
  id: string
  name: string
  avatar: string
  initials: string
}

export interface Sprint {
  id: string
  name: string
}

export interface UserStory {
  id: string
  title: string
  sprintId: string
}

export interface FilterState {
  sprints: string[]
  userStories: string[]
  assignees: string[]
  priorities: Priority[]
  statuses: Status[]
}
