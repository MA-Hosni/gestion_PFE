import { BarChart, Bar, XAxis, YAxis, Cell, LabelList } from "recharts"
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
import { Users } from "lucide-react"
import type { SprintProgress } from "@/services/project/api-dashboard"
import type { Contributor } from "@/services/project/api-project"

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkloadBarChartProps {
  sprints: SprintProgress[]
  contributors: Contributor[]
  isLoading: boolean
}

interface WorkloadItem {
  name: string
  percentage: number
  assigned: number
  total: number
}

// ─── Theme-aware Color Palette ────────────────────────────────────────────────

const BAR_THEMES: Array<{ light: string; dark: string }> = [
  { light: "hsl(221, 83%, 53%)", dark: "hsl(221, 83%, 67%)" },
  { light: "hsl(262, 83%, 53%)", dark: "hsl(262, 83%, 67%)" },
  { light: "hsl(142, 76%, 36%)", dark: "hsl(142, 76%, 50%)" },
  { light: "hsl(38, 92%, 50%)",  dark: "hsl(38, 92%, 60%)"  },
  { light: "hsl(348, 86%, 50%)", dark: "hsl(348, 86%, 65%)" },
  { light: "hsl(199, 89%, 42%)", dark: "hsl(199, 89%, 55%)" },
]

// ─── Skeleton ────────────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="space-y-3 px-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div
            className="h-6 animate-pulse rounded bg-muted"
            style={{ width: `${30 + i * 15}%` }}
          />
        </div>
      ))}
    </div>
  )
}

// ─── Derivation Logic ─────────────────────────────────────────────────────────

/**
 * We derive workload from user stories by checking how many are in each sprint.
 * Since assignedTo is not in the progress data, we distribute tasks equally among
 * contributors as an approximation.
 */
function deriveWorkload(
  sprints: SprintProgress[],
  contributors: Contributor[]
): WorkloadItem[] {
  if (!contributors.length) return []
  const totalTasks = sprints.reduce((s, sp) => s + sp.totalTasks, 0)
  if (totalTasks === 0)
    return contributors.map((c) => ({
      name: c.fullName.split(" ")[0],
      percentage: 0,
      assigned: 0,
      total: 0,
    }))

  const perPerson = Math.floor(totalTasks / contributors.length)
  const remainder = totalTasks % contributors.length

  return contributors.map((c, idx) => {
    const assigned = perPerson + (idx < remainder ? 1 : 0)
    return {
      name: c.fullName.split(" ").slice(0, 2).join(" "),
      percentage: totalTasks > 0 ? Math.round((assigned / totalTasks) * 100) : 0,
      assigned,
      total: totalTasks,
    }
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WorkloadBarChart({
  sprints,
  contributors,
  isLoading,
}: WorkloadBarChartProps) {
  const data = deriveWorkload(sprints, contributors)
  const chartHeight = Math.max(200, data.length * 52)

  // Build ChartConfig dynamically — one entry per contributor with theme colors
  const chartConfig = data.reduce<ChartConfig>((cfg, item, idx) => {
    cfg[`c${idx}`] = {
      label: item.name,
      theme: BAR_THEMES[idx % BAR_THEMES.length],
    }
    return cfg
  }, {} satisfies ChartConfig)

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users />
          <CardTitle className="text-base font-semibold">Team Workload</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Estimated task distribution per contributor
        </CardDescription>
      </CardHeader>

      <CardFooter>
        {isLoading ? (
          <ChartSkeleton />
        ) : data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No contributors data available
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="w-full"
            style={{ height: chartHeight }}
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
              barCategoryGap="30%"
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => (
                      <span>
                        {item.payload.assigned} of {item.payload.total} tasks ({value}%)
                      </span>
                    )}
                    hideLabel
                  />
                }
              />
              <Bar dataKey="percentage" radius={[6, 6, 6, 6]} maxBarSize={30}>
                {data.map((_, idx) => (
                  <Cell key={idx} fill={`var(--color-c${idx})`} />
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
