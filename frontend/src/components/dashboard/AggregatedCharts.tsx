import {
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Activity, PieChartIcon, BarChart2 } from "lucide-react"
import type { DashboardProgressData } from "@/services/project/api-dashboard"

// ─── Types ────────────────────────────────────────────────────────────────────

interface AggregatedChartsProps {
  progressData: DashboardProgressData | null
  isLoading: boolean
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function CircleSkeleton({ size = 120 }: { size?: number }) {
  return (
    <div
      className="mx-auto animate-pulse rounded-full bg-muted"
      style={{ width: size, height: size }}
    />
  )
}

function BarSkeleton() {
  return (
    <div className="flex h-32 items-end gap-3 px-4">
      {[50, 80, 40, 70, 60].map((h, i) => (
        <div
          key={i}
          className="flex-1 animate-pulse rounded-t bg-muted"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}

// ─── Radial Progress Chart ─────────────────────────────────────────────────

function RadialProgressChart({
  progress,
  isLoading,
}: {
  progress: number
  isLoading: boolean
}) {
  const data = [{ name: "Progress", value: progress, fill: "hsl(221, 83%, 63%)" }]

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity />
          <CardTitle className="text-base font-semibold">Overall Progress</CardTitle>
        </div>
        <CardDescription className="text-xs">Project-wide task completion</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col items-center">
        {isLoading ? (
          <CircleSkeleton size={160} />
        ) : (
          <div className="relative">
            <ResponsiveContainer width={180} height={180}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                startAngle={90}
                endAngle={-270}
                data={[{ value: 100, fill: "hsl(var(--muted))" }, ...data]}
              >
                <RadialBar dataKey="value" background={false} cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tabular-nums">{progress}%</span>
              <span className="text-xs text-muted-foreground">done</span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

// ─── Donut Task Split Chart ────────────────────────────────────────────────

const DONUT_COLORS = ["hsl(142, 76%, 45%)", "hsl(221, 83%, 63%)", "hsl(38, 92%, 55%)"]

function DonutTaskChart({
  progressData,
  isLoading,
}: {
  progressData: DashboardProgressData | null
  isLoading: boolean
}) {
  const total = progressData?.projectProgress.totalTasks ?? 0
  const done = progressData?.projectProgress.doneTasks ?? 0
  const remaining = Math.max(0, total - done)

  const data = [
    { name: "Done", value: done },
    { name: "Remaining", value: remaining },
  ].filter((d) => d.value > 0)

  const isEmpty = data.length === 0

  const customTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-lg border bg-popover px-3 py-2 shadow-lg text-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-muted-foreground">{payload[0].value} tasks</p>
      </div>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PieChartIcon />
          <CardTitle className="text-base font-semibold">Tasks Split</CardTitle>
        </div>
        <CardDescription className="text-xs">Done vs remaining tasks</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col items-center">
        {isLoading ? (
          <CircleSkeleton size={160} />
        ) : isEmpty ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-muted-foreground">No tasks yet</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {data.map((_, idx) => (
                    <Cell key={idx} fill={DONUT_COLORS[idx % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={customTooltip} />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground">
              {done} of {total} tasks completed
            </p>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

// ─── Sprint Progress Bar Chart ────────────────────────────────────────────

function SprintProgressChart({
  progressData,
  isLoading,
}: {
  progressData: DashboardProgressData | null
  isLoading: boolean
}) {
  const sprintData = (progressData?.sprints ?? []).map((s) => ({
    name: s.title.length > 12 ? s.title.slice(0, 12) + "…" : s.title,
    done: s.doneTasks,
    total: s.totalTasks,
    remaining: s.totalTasks - s.doneTasks,
  }))

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-lg border bg-popover px-3 py-2 shadow-lg text-sm">
        <p className="mb-1 font-semibold">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-muted-foreground" style={{ color: p.fill }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart2 />
          <CardTitle className="text-base font-semibold">Sprint Progress</CardTitle>
        </div>
        <CardDescription className="text-xs">Done vs remaining tasks per sprint</CardDescription>
      </CardHeader>
      <CardFooter>
        {isLoading ? (
          <BarSkeleton />
        ) : sprintData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No sprints available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={sprintData}
              margin={{ top: 0, right: 0, left: -36, bottom: 0 }}
              barCategoryGap="10%"
            >
              <CartesianGrid vertical={false} stroke="#f5f5f5" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={customTooltip} cursor={{ fill: "transparent" }} />
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground capitalize">{value}</span>
                )}
              />
              <Bar
                dataKey="done"
                name="Done"
                fill="hsl(142, 76%, 45%)"
                radius={[6, 6, 6, 6]}
                maxBarSize={36}
                stackId="a"
              />
              <Bar
                dataKey="remaining"
                name="Remaining"
                fill="hsl(221, 83%, 63%)"
                radius={[6, 6, 6, 6]}
                maxBarSize={36}
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardFooter>
    </Card>
  )
}

// ─── Main Aggregated Charts Export ────────────────────────────────────────────

export function AggregatedCharts({ progressData, isLoading }: AggregatedChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RadialProgressChart
        progress={progressData?.projectProgress.progress ?? 0}
        isLoading={isLoading}
      />
      <DonutTaskChart progressData={progressData} isLoading={isLoading} />
      <div className="sm:col-span-2 lg:col-span-1">
        <SprintProgressChart progressData={progressData} isLoading={isLoading} />
      </div>
    </div>
  )
}
