import { DeleteDialog } from '../delete-dialog'
import { ViewTaskDialog } from './task-dialog'
import { TaskHistoryDialog } from './task-history-dialog'
import { StatusBadge, PriorityBadge } from './task-badges'
import { User } from 'lucide-react'
import type { Task } from '../types'

interface TaskRowProps {
  task: Task
  onSave: (updated: Task) => void
  onDelete: (id: string) => void
}

export function TaskRow({ task, onSave, onDelete }: TaskRowProps) {
  return (
    <>
      {/* Main Row — no expand toggle, click actions are all in the buttons */}
      <tr className="hover:bg-muted/30 transition-colors border-b last:border-b-0">
        {/* Title */}
        <td className="py-3 pl-4 pr-3 max-w-[160px]">
          <p className="font-medium text-sm truncate">{task.title}</p>
        </td>

        {/* Description */}
        <td className="py-3 pr-3 max-w-[200px] hidden md:table-cell">
          <p className="text-xs text-muted-foreground truncate">{task.description}</p>
        </td>

        {/* Status */}
        <td className="py-3 pr-3 whitespace-nowrap">
          <StatusBadge status={task.status} />
        </td>

        {/* Priority */}
        <td className="py-3 pr-3 whitespace-nowrap hidden sm:table-cell">
          <PriorityBadge priority={task.priority} />
        </td>

        {/* Assignee */}
        <td className="py-3 pr-3 hidden lg:table-cell">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3 shrink-0" />
            <span className="truncate max-w-[100px]">{task.assignee}</span>
          </div>
        </td>

        {/* Actions — always visible */}
        <td className="py-3 pr-3">
          <div className="flex items-center justify-end gap-0.5">
            {/* Show More / Edit */}
            <ViewTaskDialog task={task} onSave={onSave} />
            {/* History */}
            <TaskHistoryDialog task={task} />
            {/* Delete */}
            <DeleteDialog
              itemType="Task"
              itemName={task.title}
              onConfirm={() => onDelete(task.id)}
            />
          </div>
        </td>
      </tr>
    </>
  )
}
