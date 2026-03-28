import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts"
import {
  Card,
  CardContent,
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
  count: number
  percentage: number
  fill: string
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: StatusItem }>
}) {
  if (!active || !payload?.length) return null
  const { name, count, percentage } = payload[0].payload
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold">{name}</p>
      <p className="text-muted-foreground">
        {count} tasks &middot; {percentage}%
      </p>
    </div>
  )
}

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
    { name: "Done", count: done, percentage: safe(done), fill: "hsl(142, 76%, 45%)" },
    { name: "In Progress", count: inProgress, percentage: safe(inProgress), fill: "hsl(221, 83%, 63%)" },
    { name: "Standby", count: standby, percentage: safe(standby), fill: "hsl(38, 92%, 55%)" },
    { name: "To Do", count: todo, percentage: safe(todo), fill: "hsl(215, 16%, 57%)" },
  ].filter((s) => s.count > 0 || !isLoading)

  // Sort descending by count for readability
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
          <ResponsiveContainer width="100%" height={Math.max(180, sorted.length * 52)}>
            <BarChart
              data={sorted}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                domain={[0, 100]}
                hide
              />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
              <Bar dataKey="percentage" radius={[6, 6, 6, 6]} maxBarSize={30}>
                {sorted.map((item, idx) => (
                  <Cell key={idx} fill={item.fill} />
                ))}
                <LabelList
                  dataKey="percentage"
                  position="right"
                  formatter={(v: number) => `${v}%`}
                  style={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardFooter>
    </Card>
  )
}
