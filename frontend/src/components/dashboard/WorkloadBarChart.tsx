import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts"
import {
  Card,
  CardContent,
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

// ─── Color Palette ────────────────────────────────────────────────────────────

const BAR_COLORS = [
  "hsl(221, 83%, 63%)",
  "hsl(262, 83%, 63%)",
  "hsl(142, 76%, 45%)",
  "hsl(38, 92%, 55%)",
  "hsl(348, 86%, 61%)",
  "hsl(199, 89%, 48%)",
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

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: WorkloadItem }>
}) {
  if (!active || !payload?.length) return null
  const { name, percentage, assigned, total } = payload[0].payload
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold">{name}</p>
      <p className="text-muted-foreground">
        {assigned} of {total} tasks ({percentage}%)
      </p>
    </div>
  )
}

// ─── Derivation Logic ─────────────────────────────────────────────────────────

/**
 * We derive workload from user stories by checking how many are in each sprint.
 * Since assignedTo is not in the progress data, we distribute tasks equally among
 * contributors as an approximation, and flag when real assignee data is unavailable.
 */
function deriveWorkload(
  sprints: SprintProgress[],
  contributors: Contributor[]
): WorkloadItem[] {
  if (!contributors.length) return []
  const totalTasks = sprints.reduce((s, sp) => s + sp.totalTasks, 0)
  if (totalTasks === 0) return contributors.map((c) => ({
    name: c.fullName.split(" ")[0],
    percentage: 0,
    assigned: 0,
    total: 0,
  }))

  // Equal distribution approximation
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
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
              barCategoryGap="30%"
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                hide
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
              <Bar dataKey="percentage" radius={[6, 6, 6, 6]} maxBarSize={30}>
                {data.map((_, idx) => (
                  <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
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
