import api from "../http/api-client"

export interface ProjectReport {
  project: {
    title: string
    description: string
    startDate: string
    endDate: string
  }
  sprints: {
    name: string
    startDate: string
    endDate: string
    userStories: {
      name: string
      description: string
      priority: string
      storyPointEstimate: number
      startDate: string
      dueDate: string
      tasks: {
        title: string
        description: string
        status: string
        priority: string
      }[]
    }[]
  }[]
}

export interface SprintReport {
  sprint: {
    title: string
    startDate: string
    endDate: string
  }
  userStories: {
    name: string
    description: string
    priority: string
    storyPointEstimate: number
    startDate: string
    dueDate: string
    tasks: {
      title: string
      description: string
      status: string
      priority: string
    }[]
  }[]
}

export const generateProjectReport = async (projectId: string): Promise<ProjectReport> => {
  const response = await api.get<{ message: string; report: ProjectReport }>(`/api/tasks/report/${projectId}`)
  return response.data.report
}

export const generateSprintReport = async (sprintId: string): Promise<SprintReport> => {
  const response = await api.get<{ message: string; report: SprintReport }>(`/api/tasks/sprintreport/${sprintId}`)
  return response.data.report
}
