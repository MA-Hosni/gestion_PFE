import api from "../http/api-client"
import type { Sprint, UserStory } from "@/components/project/backlog/types"

// ── Mappers ─────────────────────────────────────────────────────────────────

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

const mapUserStory = (us: any): UserStory => {
  const tasks = us.tasks ?? []
  return {
    id: us._id ?? us.id,
    storyName: us.storyName,
    description: us.description ?? "",
    startDate: us.startDate,
    dueDate: us.dueDate,
    priority: us.priority,
    storyPointEstimate: us.storyPointEstimate ?? 0,
    taskCount: tasks.length,
    taskStatuses: computeTaskStatuses(tasks),
    tasks,
  }
}

const mapSprint = (sprint: any): Sprint => ({
  id: sprint._id ?? sprint.id,
  title: sprint.title,
  goal: sprint.goal ?? "",
  orderIndex: sprint.orderIndex,
  startDate: sprint.startDate,
  endDate: sprint.endDate,
  userStories: (sprint.userStories ?? []).map(mapUserStory),
})

// ── API calls ───────────────────────────────────────────────────────────────

export const createSprint = async (data: { title: string; goal: string; startDate: string; endDate: string; projectId: string }): Promise<Sprint> => {
  const response = await api.post("/api/project/sprints", data)
  return mapSprint(response.data.data ?? response.data)
}

export const updateSprint = async (sprintId: string, data: Partial<{ title: string; goal: string; startDate: string; endDate: string }>): Promise<Sprint> => {
  const response = await api.patch(`/api/project/sprints/${sprintId}`, data)
  return mapSprint(response.data.data ?? response.data)
}

export const deleteSprint = async (sprintId: string) => {
  const response = await api.delete(`/api/project/sprints/${sprintId}`)
  return response.data
}

export const reorderSprints = async (sprints: { sprintId: string; orderIndex: number }[]) => {
  const response = await api.patch("/api/project/sprints/reorder", { sprints })
  return response.data
}

export const getSprintsByProject = async (_projectId: string): Promise<Sprint[]> => {
  const response = await api.get(`/api/user-story`)
  const allUserStories: any[] = response.data.data ?? []

  // We need to build sprints with their user stories.
  // The project endpoint already gives us sprint metadata.
  // We'll fetch user stories separately and group them by sprintId.
  // This function is called after we already have sprint metadata from the project.
  // So we just return the user stories grouped by sprint.
  const grouped = new Map<string, any[]>()
  for (const us of allUserStories) {
    const sid = (us.sprintId?._id ?? us.sprintId ?? "").toString()
    if (!grouped.has(sid)) grouped.set(sid, [])
    grouped.get(sid)!.push(us)
  }

  // Return as a map for the caller to merge
  return Array.from(grouped.entries()).map(([sprintId, stories]) => ({
    id: sprintId,
    title: "",
    goal: "",
    orderIndex: 0,
    startDate: "",
    endDate: "",
    userStories: stories.map(mapUserStory),
  }))
}

export const getAllUserStories = async (): Promise<Map<string, UserStory[]>> => {
  const response = await api.get("/api/user-story")
  const allUserStories: any[] = response.data.data ?? []

  const grouped = new Map<string, UserStory[]>()
  for (const us of allUserStories) {
    const sid = (us.sprintId?._id ?? us.sprintId ?? "").toString()
    if (!grouped.has(sid)) grouped.set(sid, [])
    grouped.get(sid)!.push(mapUserStory(us))
  }
  return grouped
}
