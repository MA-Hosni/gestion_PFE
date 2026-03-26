import api from "../http/api-client"
import type { TaskStatus } from "@/components/project/backlog/types"

export interface TaskHistoryEntry {
  id: string
  taskId: string
  from: TaskStatus
  to: TaskStatus
  changedBy: string
  changedAt: string
}

const mapEntry = (raw: any): TaskHistoryEntry => ({
  id: raw._id ?? raw.id,
  taskId: raw.taskId,
  from: raw.oldValue?.status ?? "Unknown",
  to: raw.newValue?.status ?? "Unknown",
  changedBy: raw.modifiedBy?.fullName ?? "Unknown",
  changedAt: raw.modifiedAt,
})

export const getTaskHistory = async (taskId: string): Promise<TaskHistoryEntry[]> => {
  const response = await api.get(`/api/tasks/history/${taskId}`)
  const data = response.data ?? []
  return (Array.isArray(data) ? data : []).map(mapEntry)
}
