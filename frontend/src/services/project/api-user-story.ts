import api from "../http/api-client"
import type { UserStory } from "@/components/project/backlog/types"

function computeTaskStatuses(tasks: any[]): { todo: number; inProgress: number; standby: number; done: number } {
  const counts = { todo: 0, inProgress: 0, standby: 0, done: 0 }
  for (const t of tasks) {
    const status = typeof t === 'object' ? t.status : null
    if (status === 'ToDo') counts.todo++
    else if (status === 'InProgress') counts.inProgress++
    else if (status === 'Standby') counts.standby++
    else if (status === 'Done') counts.done++
  }
  return counts
}

const mapUserStory = (story: any): UserStory => {
  const tasks = story.tasks ?? []
  return {
    id: story._id ?? story.id,
    storyName: story.storyName,
    description: story.description ?? "",
    startDate: story.startDate,
    dueDate: story.dueDate,
    priority: story.priority,
    storyPointEstimate: story.storyPointEstimate ?? 0,
    taskCount: tasks.length,
    taskStatuses: computeTaskStatuses(tasks),
    tasks,
  }
}

export const createUserStory = async (data: {
  sprintId: string
  storyName: string
  description?: string
  startDate: string
  dueDate: string
  priority: string
  storyPointEstimate: number
}) => {
  const response = await api.post("/api/user-story", data)
  return mapUserStory(response.data.data)
}

export const updateUserStory = async (
  userStoryId: string,
  data: Partial<{
    storyName: string
    description: string
    startDate: string
    dueDate: string
    priority: string
    storyPointEstimate: number
    sprintId: string
  }>
) => {
  const response = await api.put(`/api/user-story/${userStoryId}`, data)
  return mapUserStory(response.data.data)
}

export const deleteUserStory = async (userStoryId: string) => {
  const response = await api.delete(`/api/user-story/${userStoryId}`)
  return response.data
}

export const getUserStoriesBySprint = async (sprintId: string): Promise<UserStory[]> => {
  const response = await api.get(`/api/user-story/sprint/${sprintId}`)
  return (response.data.data ?? []).map(mapUserStory)
}
