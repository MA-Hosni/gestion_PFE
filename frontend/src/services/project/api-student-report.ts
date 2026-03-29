import api from "../http/api-client"

export interface Report {
  _id: string
  versionLabel: number
  notes: string
  filePath: string
  projectId: string
  createdAt: string
  updatedAt: string
}

export const getAllReports = async (): Promise<Report[]> => {
  const response = await api.get<{ success: boolean; data: Report[]; count: number }>("/api/report")
  return response.data.data
}

export const createReport = async (formData: FormData): Promise<Report> => {
  const response = await api.post<{ success: boolean; data: Report }>("/api/report", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return response.data.data
}

export const updateReportNotes = async (id: string, notes: string): Promise<Report> => {
  const response = await api.patch<{ success: boolean; data: Report }>(`/api/report/${id}`, { notes })
  return response.data.data
}

export const deleteReport = async (id: string): Promise<void> => {
  await api.delete<{ success: boolean }>(`/api/report/${id}`)
}
