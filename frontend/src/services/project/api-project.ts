import api from "../http/api-client"

export interface Contributor {
  _id: string
  fullName: string
  email: string
}

export interface ProjectSprint {
  _id: string
  title: string
  goal: string
  startDate: string
  endDate: string
  orderIndex: number
}

export interface Project {
  projectId: string
  title: string
  description: string
  startDate: string
  endDate: string
  contributors: Contributor[]
  sprints: ProjectSprint[]
}

export interface ProgressResponse {
  // Add specific progress fields if known, or fallback to any
  completionPercentage?: number
  [key: string]: any
}

export const getStudentProject = async () => {
  try {
    const response = await api.get<{ success: boolean; data: Project }>("/api/project")
    return response.data.data
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null
    }
    throw error
  }
}

export const getProjectProgress = async (projectId: string) => {
  try {
    const response = await api.get<{ success: boolean; data: ProgressResponse }>(`/api/dashboard/${projectId}`)
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch project progress", error)
    return null
  }
}

export const updateProjectDetails = async (data: { title?: string; description?: string; startDate?: string; endDate?: string }) => {
  const response = await api.patch<{ success: boolean; data: Project }>("/api/project", data)
  return response.data.data
}

export const getStudentsWithoutProject = async () => {
  const response = await api.get<{ success: boolean; data: { _id: string, fullName: string }[] }>("/api/project/students/without-project")
  return response.data.data
}

export const addContributors = async (projectId: string, studentIds: string[]) => {
  const response = await api.patch("/api/project/students/add-contributors", { projectId, studentIds })
  return response.data
}

export const removeContributors = async (projectId: string, studentIds: string[]) => {
  const response = await api.patch("/api/project/students/remove-contributors", { projectId, studentIds })
  return response.data
}

export const createProject = async (data: { title: string; description: string; startDate: string; endDate: string; contributors: string[] }) => {
  const response = await api.post<{ success: boolean; data: Project }>("/api/project", data)
  return response.data.data
}
