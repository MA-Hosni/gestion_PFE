import type { ColumnDef } from '@tanstack/react-table'
import { ChevronDownIcon, ChevronUpIcon, CalendarDays, ClipboardPenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import type { Sprint } from './types'
import { SprintDialog } from './sprint-dialog'
import { DeleteDialog } from './delete-dialog'
import { deleteSprint } from '@/services/project/api-sprint'
import { toast } from 'sonner'

interface SprintColumnsOptions {
  projectId: string
  onRefresh: () => void
}

export function getSprintColumns({ onRefresh }: SprintColumnsOptions): ColumnDef<Sprint>[] {
  const formatDate = (iso: string) => {
    try { return format(new Date(iso), 'dd/MM/yyyy') } catch { return iso }
  }

  return [
    {
      id: 'drag-handle',
      header: () => null,
      cell: () => null
    },
    {
      id: 'expander',
      header: () => null,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:bg-muted/50"
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? <ChevronUpIcon className="opacity-70" /> : <ChevronDownIcon className="opacity-70" />}
        </Button>
      )
    },
    {
      accessorKey: 'orderIndex',
      header: '#',
      cell: ({ row }) => <div className="font-medium px-1 text-muted-foreground whitespace-nowrap">{row.getValue('orderIndex')}</div>
    },
    {
      id: 'details',
      header: 'Sprint Title',
      cell: ({ row }) => {
        const sprint = row.original
        return (
          <div className="flex flex-col py-1">
            <span className="font-semibold text-sm">{sprint.title}</span>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
              <CalendarDays className="h-3 w-3" />
              <span>{formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}</span>
              <span className="opacity-50">•</span>
              <span className="font-medium text-foreground/70">
                {sprint.userStories.length} user stor{sprint.userStories.length === 1 ? 'y' : 'ies'}
              </span>
            </div>
          </div>
        )
      }
    },
    {
      id: 'actions',
      header: () => <div className="text-right px-4">Actions</div>,
      cell: ({ row }) => {
        const sprint = row.original
        return (
          <div className="flex items-center justify-end gap-1 px-2">
            <SprintDialog
              mode="edit"
              sprintId={sprint.id}
              initialData={{
                title: sprint.title,
                goal: sprint.goal,
                startDate: sprint.startDate,
                endDate: sprint.endDate,
              }}
              onSuccess={onRefresh}
            />
            <Button variant="outline" size="icon" className='h-8 w-8 text-muted-foreground hover:text-primary hover:bg-muted/50'>
              <ClipboardPenLine />
            </Button>
            <DeleteDialog
              itemType="Sprint"
              itemName={sprint.title}
              onConfirm={async () => {
                try {
                  await deleteSprint(sprint.id)
                  toast.success("Sprint deleted successfully")
                  onRefresh()
                } catch (err: any) {
                  toast.error(err?.response?.data?.message || "Failed to delete sprint")
                  throw err
                }
              }}
            />
          </div>
        )
      }
    }
  ]
}
