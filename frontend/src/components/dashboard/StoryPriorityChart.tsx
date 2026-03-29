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
import { Flag } from "lucide-react"
import type { SprintProgress } from "@/services/project/api-dashboard"

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoryPriorityChartProps {
  sprints: SprintProgress[]
  isLoading: boolean
}

interface PriorityItem {
  priority: string
  key: string
  count: number
}

// ─── Config (theme-aware) ─────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<
  string,
  { label: string; order: number; theme: { light: string; dark: string } }
> = {
  Critical: { label: "Critical", order: 0, theme: { light: "hsl(0, 72%, 51%)",   dark: "hsl(0, 86%, 65%)"   } },
  Highest:  { label: "Highest",  order: 1, theme: { light: "hsl(25, 95%, 50%)",  dark: "hsl(25, 95%, 60%)"  } },
  High:     { label: "High",     order: 2, theme: { light: "hsl(38, 92%, 50%)",  dark: "hsl(38, 92%, 60%)"  } },
  Medium:   { label: "Medium",   order: 3, theme: { light: "hsl(221, 83%, 53%)", dark: "hsl(221, 83%, 67%)" } },
  Low:      { label: "Low",      order: 4, theme: { light: "hsl(152, 69%, 38%)", dark: "hsl(152, 69%, 52%)" } },
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
    sprint.userStories.forEach(() => {
      const p = "Medium"
      counts[p] = (counts[p] ?? 0) + 1
    })
  })

  return Object.entries(PRIORITY_CONFIG)
    .map(([key, cfg]) => ({
      priority: cfg.label,
      key: key.toLowerCase(),
      count: counts[key] ?? 0,
    }))
    .filter((item) => item.count > 0)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StoryPriorityChart({ sprints, isLoading }: StoryPriorityChartProps) {
  const data = deriveStoryPriorities(sprints)

  const showFallback = data.length === 1 && data[0].priority === "Medium"

  const chartData: PriorityItem[] = showFallback
    ? sprints.map((s, i) => {
        const keys = Object.keys(PRIORITY_CONFIG)
        return {
          priority: s.title || `Sprint ${i + 1}`,
          key: `sprint${i}`,
          count: s.userStories.length,
        }
      })
    : data

  // Build ChartConfig dynamically — depends on whether fallback or real priorities
  const chartConfig = chartData.reduce<ChartConfig>((cfg, item, idx) => {
    if (showFallback) {
      const themeKeys = Object.values(PRIORITY_CONFIG)
      cfg[item.key] = {
        label: item.priority,
        theme: themeKeys[idx % themeKeys.length].theme,
      }
    } else {
      const pcfg = Object.values(PRIORITY_CONFIG).find((p) => p.label === item.priority)
      if (pcfg) {
        cfg[item.key] = { label: item.priority, theme: pcfg.theme }
      }
    }
    return cfg
  }, {} satisfies ChartConfig)

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
          <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 0, left: -30, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="priority"
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
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <span>
                        {value} user {Number(value) === 1 ? "story" : "stories"}
                      </span>
                    )}
                    hideLabel
                  />
                }
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={36}>
                {chartData.map((item) => (
                  <Cell key={item.key} fill={`var(--color-${item.key})`} />
                ))}
                <LabelList
                  dataKey="count"
                  position="top"
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
