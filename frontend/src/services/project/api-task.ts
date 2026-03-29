import api from "../http/api-client"
import type { Task } from "@/components/project/backlog/types"

const mapTask = (task: any): Task => ({
  id: task._id ?? task.id,
  title: task.title,
  description: task.description ?? "",
  status: task.status,
  priority: task.priority ?? "Medium",
  userStoryId: task.userStoryId,
  assignedTo: task.assignedTo ?? undefined,
})

export const createTask = async (data: {
  title: string
  description?: string
  status: string
  priority?: string
  userStoryId: string
  assignedTo?: string
}): Promise<Task> => {
  const response = await api.post("/api/tasks", data)
  return mapTask(response.data.task)
}

export const getTasksByUserStory = async (userStoryId: string): Promise<Task[]> => {
  const response = await api.get(`/api/tasks/userstory/${userStoryId}`)
  const tasks = response.data.tasks?.tasks ?? response.data.tasks ?? []
  return Array.isArray(tasks) ? tasks.map(mapTask) : []
}

export const getTaskById = async (taskId: string): Promise<Task> => {
  const response = await api.get(`/api/tasks/${taskId}`)
  return mapTask(response.data.task?.task ?? response.data.task)
}

export const updateTask = async (taskId: string, data: {
  title?: string
  description?: string
  status?: string
  priority?: string
  assignedTo?: string
}): Promise<Task> => {
  const response = await api.patch(`/api/tasks/${taskId}`, data)
  return mapTask(response.data.task?.task ?? response.data.task)
}

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/api/tasks/${taskId}`)
}
