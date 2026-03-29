export type Priority = 'Low' | 'Medium' | 'High'
export type Status = 'ToDo' | 'InProgress' | 'Standby' | 'Done'

export interface BoardTask {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  userStoryId: string
  userStoryName: string
  sprintId: string
  assignedTo?: string
}

export interface BoardSprint {
  id: string
  title: string
}

export interface BoardUserStory {
  id: string
  name: string
  sprintId: string
}

export interface FilterState {
  sprints: string[]
  userStories: string[]
  assignees: string[]
  priorities: Priority[]
  statuses: Status[]
}
