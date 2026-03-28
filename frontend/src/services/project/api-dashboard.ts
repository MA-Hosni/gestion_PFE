import api from "../http/api-client"

// ─── Response Shape Interfaces ────────────────────────────────────────────────

export interface UserStoryProgress {
  _id: string
  storyName: string
  priority?: string
  totalTasks: number
  doneTasks: number
  progress: number
}

export interface SprintProgress {
  _id: string
  title: string
  startDate: string
  endDate: string
  totalTasks: number
  doneTasks: number
  progress: number
  userStories: UserStoryProgress[]
}

export interface ProjectProgress {
  totalTasks: number
  doneTasks: number
  progress: number
}

export interface DashboardProgressData {
  projectProgress: ProjectProgress
  sprints: SprintProgress[]
}

export type TimelineEventType = "meeting" | "report" | "status_change" | "validation"

export interface TimelineEvent {
  type: TimelineEventType
  date: string
  title: string
  description: string
  projectId?: string
  projectName?: string
  metadata?: Record<string, unknown>
}

export interface StandbyTask {
  _id: string
  title: string
  description?: string
  status: string
  priority: string
  userStoryId: {
    _id: string
    storyName: string
    priority: string
  } | null
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Fetches aggregated project progress data including sprints and user stories.
 * GET /api/dashboard/:projectId
 */
export const getDashboardProgress = async (
  projectId: string
): Promise<DashboardProgressData> => {
  const response = await api.get<{
    success: boolean
    data: DashboardProgressData
  }>(`/api/dashboard/${projectId}`)
  return response.data.data
}

/**
 * Fetches student timeline events for a given month/year.
 * GET /api/dashboard/student/timeline?month=&year=
 */
export const getStudentTimeline = async (
  month: number,
  year: number
): Promise<TimelineEvent[]> => {
  const response = await api.get<{
    success: boolean
    count: number
    data: TimelineEvent[]
  }>("/api/dashboard/student/timeline", {
    params: { month, year },
  })
  return response.data.data ?? []
}

/**
 * Fetches tasks with status "Standby" for the student's project.
 * GET /api/dashboard/student/tasks/standby
 */
export const getStudentStandbyTasks = async (): Promise<StandbyTask[]> => {
  const response = await api.get<{
    success: boolean
    count: number
    data: StandbyTask[]
  }>("/api/dashboard/student/tasks/standby")
  return response.data.data ?? []
}
