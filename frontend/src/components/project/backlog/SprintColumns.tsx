import type { ColumnDef } from '@tanstack/react-table'
import { ChevronDownIcon, ChevronUpIcon, Edit2, CalendarDays, ClipboardPenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Sprint } from './types'
import { SprintDialog } from './sprint-dialog'
import { DeleteDialog } from './delete-dialog'

export const sprintColumns: ColumnDef<Sprint>[] = [
  {
    id: 'drag-handle',
    header: () => null,
    cell: () => null // Rendered manually in BacklogPage
  },
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:bg-muted/50"
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? <ChevronUpIcon className="opacity-70" /> : <ChevronDownIcon className="opacity-70" />}
        </Button>
      )
    }
  },
  {
    accessorKey: 'order',
    header: '#',
    cell: ({ row }) => <div className="font-medium px-1 text-muted-foreground whitespace-nowrap">{row.getValue('order')}</div>
  },
  {
    id: 'details',
    header: 'Sprint Title',
    cell: ({ row }) => {
      const sprint = row.original
      const { name, startDate, endDate, userStories } = sprint
      return (
        <div className="flex flex-col py-1">
          <span className="font-semibold text-sm">{name}</span>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
            <CalendarDays className="h-3 w-3" />
            <span>{startDate} - {endDate}</span>
            <span className="opacity-50">•</span>
            <span className="font-medium text-foreground/70">{userStories.length} user stor{userStories.length === 1 ? 'y' : 'ies'}</span>
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
          <SprintDialog buttonText={<Edit2 />} title='Edit Sprint' description='Edit sprint details.' />
          <DeleteDialog 
            itemType="Sprint" 
            itemName={sprint.name}
            variant="outline"
            onConfirm={() => console.log('Delete sprint', sprint.id)} 
          />
          <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-muted/50">
            <ClipboardPenLine />
          </Button>
        </div>
      )
    }
  }
]
