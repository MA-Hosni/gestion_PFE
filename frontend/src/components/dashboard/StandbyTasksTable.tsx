import { Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { StandbyTask } from "@/services/project/api-dashboard"

// ─── Types ────────────────────────────────────────────────────────────────────

interface StandbyTasksTableProps {
  tasks: StandbyTask[]
  isLoading: boolean
}

// ─── Priority Badge Config ────────────────────────────────────────────────────

const priorityStyles: Record<string, string> = {
  Critical: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
  Highest: "bg-orange-500/15 text-orange-600 border-orange-500/30 dark:text-orange-400",
  High: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  Medium: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
  Low: "bg-slate-500/15 text-slate-600 border-slate-500/30 dark:text-slate-400",
}

function PriorityBadge({ priority }: { priority: string }) {
  const cls =
    priorityStyles[priority] ??
    "bg-muted text-muted-foreground border-border"
  return (
    <Badge
      variant="outline"
      className={`px-2 py-0.5 text-xs font-medium ${cls}`}
    >
      {priority}
    </Badge>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 3 }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </TableCell>
      ))}
    </TableRow>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StandbyTasksTable({ tasks, isLoading }: StandbyTasksTableProps) {
  const priorityOrder: Record<string, number> = {
    Critical: 0,
    Highest: 1,
    High: 2,
    Medium: 3,
    Low: 4,
  }

  const sorted = [...tasks].sort((a, b) => {
    const ap = priorityOrder[a.userStoryId?.priority ?? "Medium"] ?? 3
    const bp = priorityOrder[b.userStoryId?.priority ?? "Medium"] ?? 3
    return ap - bp
  })

  return (
    <Card className="flex flex-col shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Clock />
          <CardTitle className="text-base font-semibold">Standby Tasks</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Tasks awaiting clearance or blocked
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="px-4 pb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>User Story</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No standby tasks — great job!</p>
          </div>
        ) : (
          <div className="max-h-[340px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="pl-6">Task</TableHead>
                  <TableHead>User Story</TableHead>
                  <TableHead className="pr-6">Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((task) => (
                  <TableRow
                    key={task._id}
                    className="group transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="pl-6">
                      <span className="line-clamp-2 max-w-[180px] text-sm font-medium leading-snug">
                        {task.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="line-clamp-1 max-w-[160px] text-xs text-muted-foreground">
                        {task.userStoryId?.storyName ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="pr-6">
                      <PriorityBadge
                        priority={
                          task.userStoryId?.priority ?? task.priority ?? "Medium"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
