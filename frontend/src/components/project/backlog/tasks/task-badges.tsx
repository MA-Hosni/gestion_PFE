import { Badge } from '@/components/ui/badge'
import type { TaskPriority, TaskStatus } from '../types'

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  ToDo:       { label: 'To Do',       className: 'bg-muted text-muted-foreground border-transparent' },
  InProgress: { label: 'In Progress', className: 'bg-blue-100/60 text-blue-700 border-transparent' },
  Standby:    { label: 'Standby',     className: 'bg-orange-100/60 text-orange-700 border-transparent' },
  Done:       { label: 'Done',        className: 'bg-green-100/60 text-green-700 border-transparent' },
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
  Low:    { label: 'Low',    className: 'bg-green-100/60 text-green-700 border-transparent' },
  Medium: { label: 'Medium', className: 'bg-yellow-100/60 text-yellow-700 border-transparent' },
  High:   { label: 'High',   className: 'bg-red-100/60 text-red-700 border-transparent' },
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status]
  return <Badge variant="outline" className={`text-xs px-2 py-0.5 shadow-sm ${cfg.className}`}>{cfg.label}</Badge>
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const cfg = PRIORITY_CONFIG[priority]
  return <Badge variant="outline" className={`text-xs px-2 py-0.5 shadow-sm ${cfg.className}`}>{cfg.label}</Badge>
}
