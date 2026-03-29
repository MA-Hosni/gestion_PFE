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
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Card,
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

// ─── 1. Radial Progress Chart ──────────────────────────────────────────────────

const radialConfig = {
  progress: {
    label: "Progress",
    theme: { light: "hsl(221, 83%, 53%)", dark: "hsl(221, 83%, 67%)" },
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig

function RadialProgressChart({
  progress,
  isLoading,
}: {
  progress: number
  isLoading: boolean
}) {
  const data = [
    { name: "remaining", value: 100 - progress, fill: "var(--color-remaining)" },
    { name: "progress",  value: progress,        fill: "var(--color-progress)"  },
  ]

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
            <ChartContainer
              config={radialConfig}
              className="mx-auto aspect-square"
              style={{ width: 180, height: 180 }}
            >
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                startAngle={90}
                endAngle={-270}
                data={data}
              >
                <RadialBar dataKey="value" background={false} cornerRadius={8} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="name" />}
                />
              </RadialBarChart>
            </ChartContainer>
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

// ─── 2. Donut Task Split Chart ────────────────────────────────────────────────

const donutConfig = {
  done: {
    label: "Done",
    theme: { light: "hsl(142, 76%, 36%)", dark: "hsl(142, 71%, 45%)" },
  },
  remaining: {
    label: "Remaining",
    theme: { light: "hsl(221, 83%, 53%)", dark: "hsl(221, 83%, 67%)" },
  },
} satisfies ChartConfig

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
    { name: "done",      value: done,      fill: "var(--color-done)"      },
    { name: "remaining", value: remaining, fill: "var(--color-remaining)" },
  ].filter((d) => d.value > 0)

  const isEmpty = data.length === 0

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
            <ChartContainer
              config={donutConfig}
              className="mx-auto aspect-square h-[180px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent nameKey="name" hideLabel />}
                />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
            <p className="text-xs text-muted-foreground">
              {done} of {total} tasks completed
            </p>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

// ─── 3. Sprint Progress Stacked Bar Chart ──────────────────────────────────────

const sprintConfig = {
  done: {
    label: "Done",
    theme: { light: "hsl(142, 76%, 36%)", dark: "hsl(142, 71%, 45%)" },
  },
  remaining: {
    label: "Remaining",
    theme: { light: "hsl(221, 83%, 53%)", dark: "hsl(221, 83%, 67%)" },
  },
} satisfies ChartConfig

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
          <ChartContainer config={sprintConfig} className="aspect-auto h-[200px] w-full">
            <BarChart
              data={sprintData}
              margin={{ top: 0, right: 0, left: -36, bottom: 0 }}
              barCategoryGap="10%"
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="done"
                fill="var(--color-done)"
                radius={[6, 6, 6, 6]}
                maxBarSize={36}
                stackId="a"
              />
              <Bar
                dataKey="remaining"
                fill="var(--color-remaining)"
                radius={[6, 6, 6, 6]}
                maxBarSize={36}
                stackId="a"
              />
            </BarChart>
          </ChartContainer>
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
