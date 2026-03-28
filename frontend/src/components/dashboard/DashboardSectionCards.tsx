import { CheckCircle2, RefreshCw, PlusCircle, AlertTriangle } from "lucide-react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { DashboardProgressData, StandbyTask } from "@/services/project/api-dashboard"

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardSectionCardsProps {
  progressData: DashboardProgressData | null
  standbyTasks: StandbyTask[]
  isLoading: boolean
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-2">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="mt-2 h-8 w-16 rounded bg-muted" />
      </CardHeader>
      <CardFooter>
        <div className="h-3 w-32 rounded bg-muted" />
      </CardFooter>
    </Card>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardSectionCards({
  progressData,
  standbyTasks,
  isLoading,
}: DashboardSectionCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const allUserStories = progressData?.sprints.flatMap((s) => s.userStories) ?? []

  // ── Stat derivation ──────────────────────────────────────────────────────
  const totalTasks = progressData?.projectProgress.totalTasks ?? 0
  const doneTasks = progressData?.projectProgress.doneTasks ?? 0
  const overallProgress = progressData?.projectProgress.progress ?? 0

  // Approximation: "created in last 7 days" – we don't have timestamps at this
  // level, so we show total user stories as a proxy for created items
  const totalUserStories = allUserStories.length

  const standbyCount = standbyTasks.length

  // In-progress = tasks that are neither done nor standby
  const inProgressTasks = totalTasks - doneTasks - standbyCount

  const cards = [
    {
      label: "Tasks Completed",
      value: doneTasks,
      sub: `${overallProgress}% of project done`,
      icon: <CheckCircle2 />,
    },
    {
      label: "In Progress",
      value: inProgressTasks > 0 ? inProgressTasks : 0,
      sub: `out of ${totalTasks} total tasks`,
      icon: <RefreshCw />,
    },
    {
      label: "User Stories",
      value: totalUserStories,
      sub: `across ${progressData?.sprints.length ?? 0} sprints`,
      icon: <PlusCircle />,
    },
    {
      label: "Standby Tasks",
      value: standbyCount,
      sub: standbyCount > 0 ? "Awaiting clearance" : "All clear",
      icon: <AlertTriangle />,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="@container/card"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-sm font-medium">
              {/* {card.icon} */}
              {card.label}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value.toLocaleString()}
            </CardTitle>
            <CardAction>
              {card.icon}
            </CardAction>
          </CardHeader>
          <CardFooter>
            <p className="text-xs text-muted-foreground">{card.sub}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
