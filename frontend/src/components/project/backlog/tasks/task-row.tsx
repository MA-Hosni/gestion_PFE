import { DeleteDialog } from '../delete-dialog'
import { ViewEditTaskDialog } from './task-dialog'
import { StatusBadge, PriorityBadge } from './task-badges'
import { User } from 'lucide-react'
import type { Task } from '../types'
import type { Contributor } from '@/services/project/api-project'
import { CreateMeetingDialog } from '../create-meeting-dialog'
import type { CalendarMeeting } from '@/components/project/meeting-calendar/calendar/calendar-types'
import { deleteTask } from '@/services/project/api-task'
import { toast } from 'sonner'
import { TaskHistoryDialog } from './task-history-dialog'

interface TaskRowProps {
  task: Task
  contributors: Contributor[]
  onRefresh: () => void
  currentUserId: string
  onCreateMeeting: (
    meeting: Omit<CalendarMeeting, 'id' | 'color'> & { color?: string }
  ) => void
}

export function TaskRow({
  task,
  contributors,
  onRefresh,
  currentUserId,
  onCreateMeeting,
}: TaskRowProps) {
  const assigneeName = task.assignedTo
    ? (contributors.find(c => c._id === task.assignedTo)?.fullName ?? "Unknown")
    : "Unassigned"

  return (
    <tr className="hover:bg-muted/30 transition-colors border-b last:border-b-0">
      {/* Title */}
      <td className="py-3 pl-4 pr-3 max-w-40">
        <p className="font-medium text-sm truncate">{task.title}</p>
      </td>

      {/* Description */}
      <td className="py-3 pr-3 max-w-50 hidden md:table-cell">
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
          <span className="truncate max-w-25">{assigneeName}</span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-3 pr-3">
        <div className="flex items-center justify-end gap-0.5">
          <CreateMeetingDialog
            referenceType="task"
            referenceId={task.id}
            defaultAgenda={`Meeting: ${task.title}`}
            createdBy={currentUserId}
            onCreateMeeting={onCreateMeeting}
            varient="ghost"
          />
          <ViewEditTaskDialog task={task} contributors={contributors} onRefresh={onRefresh} />
          <TaskHistoryDialog task={task} />
          <DeleteDialog
            varient="ghost"
            itemType="Task"
            itemName={task.title}
            onConfirm={async () => {
              try {
                await deleteTask(task.id)
                toast.success("Task deleted successfully")
                onRefresh()
              } catch (err: any) {
                toast.error(err.response?.data?.message || "Failed to delete task")
              }
            }}
          />
        </div>
      </td>
    </tr>
  )
}
