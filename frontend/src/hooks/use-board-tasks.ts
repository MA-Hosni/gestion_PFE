import { useState, useEffect, useCallback } from 'react'
import type { ProjectSprint } from '@/services/project/api-project'
import type { BoardTask, BoardSprint, BoardUserStory, Status } from '@/components/project/board/types'
import { getBoardData, persistTaskStatus } from '@/services/project/api-board'
import { toast } from 'sonner'

interface UseBoardTasksOptions {
  projectSprints: ProjectSprint[]
}

export function useBoardTasks({ projectSprints }: UseBoardTasksOptions) {
  const [tasks, setTasks] = useState<BoardTask[]>([])
  const [sprints, setSprints] = useState<BoardSprint[]>([])
  const [userStories, setUserStories] = useState<BoardUserStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (projectSprints.length === 0) {
      setTasks([])
      setSprints([])
      setUserStories([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getBoardData(projectSprints)
      setTasks(data.tasks)
      setSprints(data.sprints)
      setUserStories(data.userStories)
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to load board data"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [projectSprints])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const moveTask = useCallback(async (
    taskId: string,
    newStatus: Status,
    previousStatus: Status,
  ) => {
    try {
      await persistTaskStatus(taskId, newStatus)
    } catch (err: any) {
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, status: previousStatus } : t
      ))
      toast.error(err?.response?.data?.message || "Failed to update task status")
    }
  }, [])

  return {
    tasks,
    setTasks,
    sprints,
    userStories,
    loading,
    error,
    refresh: fetchData,
    moveTask,
  }
}
