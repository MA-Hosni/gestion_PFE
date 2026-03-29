import { useCallback, useEffect, useState } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

import { DashboardSectionCards } from "@/components/dashboard/DashboardSectionCards"
import { AggregatedCharts } from "@/components/dashboard/AggregatedCharts"
import { WorkloadBarChart } from "@/components/dashboard/WorkloadBarChart"
import { TaskStatusBarChart } from "@/components/dashboard/TaskStatusBarChart"
import { StoryPriorityChart } from "@/components/dashboard/StoryPriorityChart"
import { TimelineCalendar } from "@/components/dashboard/TimelineCalendar"
import { StandbyTasksTable } from "@/components/dashboard/StandbyTasksTable"

import {
  getDashboardProgress,
  getStudentTimeline,
  getStudentStandbyTasks,
  type DashboardProgressData,
  type StandbyTask,
  type TimelineEvent,
} from "@/services/project/api-dashboard"
import type { Contributor } from "@/services/project/api-project"

interface DashboardPageProps {
  projectId: string
  contributors: Contributor[]
}


export default function DashboardPage({ projectId, contributors }: DashboardPageProps) {
  const [progressData, setProgressData] = useState<DashboardProgressData | null>(null)
  const [standbyTasks, setStandbyTasks] = useState<StandbyTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    if (!projectId) return
    setIsLoading(true)
    setError(null)

    try {
      const [progress, standby] = await Promise.all([
        getDashboardProgress(projectId),
        getStudentStandbyTasks(),
      ])
      setProgressData(progress)
      setStandbyTasks(standby)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load dashboard data"
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleFetchTimeline = useCallback(
    async (month: number, year: number): Promise<TimelineEvent[]> => {
      return await getStudentTimeline(month, year)
    },
    []
  )

  if (error && !isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="flex max-w-md items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDashboardData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 pt-4">
      {/* ── Section Cards ──────────────────────────────────────────────────── */}
      <div className="@container/main flex flex-1 flex-col">
        <div className="flex flex-col">
          <DashboardSectionCards
            progressData={progressData}
            standbyTasks={standbyTasks}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* ── Aggregated Charts: Radial + Donut + Sprint bar ─────────────────── */}
      <section className="px-4 lg:px-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Progress Overview
        </h2>
        <AggregatedCharts progressData={progressData} isLoading={isLoading} />
      </section>

      {/* ── Analysis Charts: Workload + Task Status + User Story Priorities ── */}
      <section className="px-4 lg:px-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Analysis
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <WorkloadBarChart
            sprints={progressData?.sprints ?? []}
            contributors={contributors}
            isLoading={isLoading}
          />
          <TaskStatusBarChart
            progressData={progressData}
            standbyTasks={standbyTasks}
            isLoading={isLoading}
          />
          <StoryPriorityChart
            sprints={progressData?.sprints ?? []}
            isLoading={isLoading}
          />
        </div>
      </section>

      {/* ── Timeline Calendar + Standby Tasks ──────────────────────────────── */}
      <section className="px-4 lg:px-6 pb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Activity
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TimelineCalendar onFetchTimeline={handleFetchTimeline} />
          <StandbyTasksTable tasks={standbyTasks} isLoading={isLoading} />
        </div>
      </section>
    </div>
  )
}
