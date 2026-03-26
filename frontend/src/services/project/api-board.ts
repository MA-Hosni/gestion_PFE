import api from "../http/api-client"
import type { ProjectSprint } from "./api-project"
import type { BoardTask, BoardSprint, BoardUserStory } from "@/components/project/board/types"

export interface BoardData {
  tasks: BoardTask[]
  sprints: BoardSprint[]
  userStories: BoardUserStory[]
}

export async function getBoardData(projectSprints: ProjectSprint[]): Promise<BoardData> {
  const response = await api.get("/api/user-story")
  const allUserStories: any[] = response.data.data ?? []

  const projectSprintIds = new Set(projectSprints.map(s => s._id))

  const tasks: BoardTask[] = []
  const sprints: BoardSprint[] = projectSprints.map(s => ({ id: s._id, title: s.title }))
  const userStories: BoardUserStory[] = []

  for (const us of allUserStories) {
    const sid = (us.sprintId?._id ?? us.sprintId ?? "").toString()
    if (!projectSprintIds.has(sid)) continue

    const usId = (us._id ?? us.id).toString()
    const usName = us.storyName ?? us.title ?? ""
    userStories.push({ id: usId, name: usName, sprintId: sid })

    const usTasks = us.tasks ?? []
    for (const t of usTasks) {
      if (typeof t !== "object" || !t) continue
      tasks.push({
        id: (t._id ?? t.id).toString(),
        title: t.title ?? "",
        description: t.description ?? "",
        status: t.status ?? "ToDo",
        priority: t.priority ?? "Medium",
        userStoryId: usId,
        userStoryName: usName,
        sprintId: sid,
        assignedTo: t.assignedTo ? t.assignedTo.toString() : undefined,
      })
    }
  }

  return { tasks, sprints, userStories }
}

export async function persistTaskStatus(taskId: string, status: string): Promise<void> {
  await api.patch(`/api/tasks/${taskId}`, { status })
}
