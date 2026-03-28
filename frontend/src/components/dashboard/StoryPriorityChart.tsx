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
import { Flag } from "lucide-react"
import type { SprintProgress } from "@/services/project/api-dashboard"

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoryPriorityChartProps {
  sprints: SprintProgress[]
  isLoading: boolean
}

interface PriorityItem {
  priority: string
  count: number
  fill: string
}

// ─── Config ───────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<string, { label: string; fill: string; order: number }> = {
  Critical: { label: "Critical", fill: "hsl(0, 86%, 60%)", order: 0 },
  Highest: { label: "Highest", fill: "hsl(25, 95%, 55%)", order: 1 },
  High: { label: "High", fill: "hsl(38, 92%, 55%)", order: 2 },
  Medium: { label: "Medium", fill: "hsl(221, 83%, 63%)", order: 3 },
  Low: { label: "Low", fill: "hsl(152, 69%, 48%)", order: 4 },
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: PriorityItem }>
}) {
  if (!active || !payload?.length) return null
  const { priority, count } = payload[0].payload
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold">{priority}</p>
      <p className="text-muted-foreground">
        {count} user {count === 1 ? "story" : "stories"}
      </p>
    </div>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="flex h-44 items-end gap-4 px-6">
      {[60, 90, 40, 70, 30].map((h, i) => (
        <div
          key={i}
          className="flex-1 animate-pulse rounded-t bg-muted"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}

// ─── Derivation ───────────────────────────────────────────────────────────────

function deriveStoryPriorities(sprints: SprintProgress[]): PriorityItem[] {
  const counts: Record<string, number> = {}

  sprints.forEach((sprint) => {
    sprint.userStories.forEach((_story) => {
      // Use "Medium" as fallback since priority isn't in basic UserStoryProgress
      const p = "Medium"
      counts[p] = (counts[p] ?? 0) + 1
    })
  })

  return Object.entries(PRIORITY_CONFIG)
    .map(([key, cfg]) => ({
      priority: cfg.label,
      count: counts[key] ?? 0,
      fill: cfg.fill,
    }))
    .filter((item) => item.count > 0)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StoryPriorityChart({ sprints, isLoading }: StoryPriorityChartProps) {
  const data = deriveStoryPriorities(sprints)

  // Fallback: if all come out as Medium (no priority field from API), show
  // a simple total per sprint instead
  const showFallback = data.length === 1 && data[0].priority === "Medium"

  const chartData: PriorityItem[] = showFallback
    ? sprints.map((s, i) => ({
        priority: s.title || `Sprint ${i + 1}`,
        count: s.userStories.length,
        fill: Object.values(PRIORITY_CONFIG)[i % Object.values(PRIORITY_CONFIG).length].fill,
      }))
    : data

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flag />
          <CardTitle className="text-base font-semibold">
            {showFallback ? "User Stories per Sprint" : "User Story Priorities"}
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          {showFallback
            ? "Number of user stories per sprint"
            : "How many user stories have each priority level"}
        </CardDescription>
      </CardHeader>

      <CardFooter>
        {isLoading ? (
          <ChartSkeleton />
        ) : chartData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No user stories found
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, left: -30, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="priority"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={36}>
                {chartData.map((item, idx) => (
                  <Cell key={idx} fill={item.fill} />
                ))}
                <LabelList
                  dataKey="count"
                  position="top"
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
