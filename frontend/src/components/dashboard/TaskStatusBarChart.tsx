import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LayoutList } from "lucide-react"
import type { DashboardProgressData, StandbyTask } from "@/services/project/api-dashboard"

// ─── Types ────────────────────────────────────────────────────────────────────

interface TaskStatusBarChartProps {
  progressData: DashboardProgressData | null
  standbyTasks: StandbyTask[]
  isLoading: boolean
}

interface StatusItem {
  name: string
  key: string
  count: number
  percentage: number
}

// ─── Chart Config (theme-aware) ───────────────────────────────────────────────

const chartConfig = {
  done: {
    label: "Done",
    theme: { light: "hsl(142, 76%, 36%)", dark: "hsl(142, 71%, 45%)" },
  },
  inProgress: {
    label: "In Progress",
    theme: { light: "hsl(221, 83%, 53%)", dark: "hsl(221, 83%, 67%)" },
  },
  standby: {
    label: "Standby",
    theme: { light: "hsl(38, 92%, 50%)", dark: "hsl(38, 92%, 60%)" },
  },
  todo: {
    label: "To Do",
    theme: { light: "hsl(215, 16%, 47%)", dark: "hsl(215, 16%, 65%)" },
  },
} satisfies ChartConfig

// ─── Skeleton ────────────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="space-y-4 px-2 py-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div
            className="h-6 animate-pulse rounded bg-muted"
            style={{ width: `${20 + i * 20}%` }}
          />
        </div>
      ))}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskStatusBarChart({
  progressData,
  standbyTasks,
  isLoading,
}: TaskStatusBarChartProps) {
  const total = progressData?.projectProgress.totalTasks ?? 0
  const done = progressData?.projectProgress.doneTasks ?? 0
  const standby = standbyTasks.length
  const inProgress = Math.max(0, total - done - standby)
  const todo = Math.max(0, total - done - standby - inProgress)

  const safe = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0)

  const statuses: StatusItem[] = [
    { name: "Done",        key: "done",       count: done,       percentage: safe(done)       },
    { name: "In Progress", key: "inProgress", count: inProgress, percentage: safe(inProgress) },
    { name: "Standby",     key: "standby",    count: standby,    percentage: safe(standby)    },
    { name: "To Do",       key: "todo",       count: todo,       percentage: safe(todo)       },
  ].filter((s) => s.count > 0 || !isLoading)

  const sorted = [...statuses].sort((a, b) => b.count - a.count)

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <LayoutList />
          <CardTitle className="text-base font-semibold">Task Status Breakdown</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Distribution across all task statuses
        </CardDescription>
      </CardHeader>

      <CardFooter>
        {isLoading ? (
          <ChartSkeleton />
        ) : total === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No tasks found in this project yet
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="w-full"
            style={{ height: Math.max(180, sorted.length * 52) }}
          >
            <BarChart
              data={sorted}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => (
                      <span>
                        {item.payload.count} tasks · {value}%
                      </span>
                    )}
                    hideLabel
                  />
                }
              />
              <Bar dataKey="percentage" radius={[6, 6, 6, 6]} maxBarSize={30}>
                {sorted.map((item) => (
                  <Cell key={item.key} fill={`var(--color-${item.key})`} />
                ))}
                <LabelList
                  dataKey="percentage"
                  position="right"
                  formatter={(v: number) => `${v}%`}
                  className="fill-muted-foreground text-[11px] font-semibold"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardFooter>
    </Card>
  )
}
