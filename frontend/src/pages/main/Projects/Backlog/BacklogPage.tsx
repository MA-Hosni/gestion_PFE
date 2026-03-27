import { useState, useEffect, Fragment, useMemo, useCallback } from 'react'
import { SearchIcon, GripVertical } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type ExpandedState,
  type Row
} from '@tanstack/react-table'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'

import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { getSprintColumns } from '@/components/project/backlog/SprintColumns'
import { NestedUserStories } from '@/components/project/backlog/NestedUserStories'
import { SprintDialog } from '@/components/project/backlog/sprint-dialog'
import type { Sprint } from '@/components/project/backlog/types'
import type { ProjectSprint, Contributor } from '@/services/project/api-project'
import { reorderSprints, getAllUserStories } from '@/services/project/api-sprint'
import { toast } from 'sonner'
import type { CreateMeetingInput } from '@/hooks/use-meetings'

// ── Helpers ──────────────────────────────────────────────────────────────────

function mapProjectSprintsToSprints(
  projectSprints: ProjectSprint[],
  userStoriesMap: Map<string, Sprint['userStories']>
): Sprint[] {
  return projectSprints
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(s => ({
      id: s._id,
      title: s.title,
      goal: s.goal,
      orderIndex: s.orderIndex,
      startDate: s.startDate,
      endDate: s.endDate,
      userStories: userStoriesMap.get(s._id) ?? [],
    }))
}

// ── Draggable Row ────────────────────────────────────────────────────────────

function DraggableRow({
  row,
  contributors,
  onCreateMeeting,
  onRefresh,
}: {
  row: Row<Sprint>
  contributors: Contributor[]
  onCreateMeeting: (meeting: CreateMeetingInput) => Promise<unknown> | unknown
  onRefresh: () => void
}) {
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: row.original.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <Fragment>
      <TableRow
        ref={setNodeRef}
        style={style}
        data-state={row.getIsSelected() && 'selected'}
        className={cn(
          "group hover:bg-muted/30 transition-colors",
          isDragging ? "bg-muted relative z-50 opacity-90 shadow-lg" : ""
        )}
      >
        {row.getVisibleCells().map(cell => (
          <TableCell
            key={cell.id}
            className={cn(
              cell.column.id === 'expander' ? 'w-10 px-2' : '',
              cell.column.id === 'drag-handle' ? 'w-10 px-1' : ''
            )}
          >
            {cell.column.id === 'drag-handle' ? (
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1.5 rounded-md text-muted-foreground/50 hover:bg-muted/80 hover:text-foreground inline-flex items-center justify-center transition-colors touch-none"
              >
                <GripVertical className="h-4 w-4" />
              </div>
            ) : (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
          </TableCell>
        ))}
      </TableRow>
      {/* Expanded User Stories */}
      {row.getIsExpanded() && !isDragging && (
        <TableRow className='hover:bg-transparent bg-muted/5 border-b'>
          <TableCell colSpan={row.getVisibleCells().length} className='p-0'>
            <NestedUserStories
              sprint={row.original}
              contributors={contributors}
              onCreateMeeting={onCreateMeeting}
              onRefresh={onRefresh}
            />
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

interface BacklogPageProps {
  contributors: Contributor[]
  onCreateMeeting: (meeting: CreateMeetingInput) => Promise<unknown> | unknown
  projectSprints: ProjectSprint[]
  projectId: string
  onRefresh: () => void
}

const BacklogPage = ({ contributors, onCreateMeeting, projectSprints, projectId, onRefresh }: BacklogPageProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [expanded, setExpanded] = useState<ExpandedState>(true)

  // Load user stories and merge with project sprint metadata
  const loadSprints = useCallback(async () => {
    try {
      const userStoriesMap = await getAllUserStories()
      setSprints(mapProjectSprintsToSprints(projectSprints, userStoriesMap))
    } catch {
      // If fetching user stories fails, show sprints without them
      setSprints(mapProjectSprintsToSprints(projectSprints, new Map()))
    }
  }, [projectSprints])

  useEffect(() => {
    loadSprints()
  }, [loadSprints])

  const handleRefresh = useCallback(() => {
    onRefresh()
    loadSprints()
  }, [onRefresh, loadSprints])

  const columns = useMemo(
    () => getSprintColumns({ projectId, onRefresh: handleRefresh }),
    [projectId, handleRefresh]
  )

  const filteredSprints = useMemo(() => {
    if (!searchQuery.trim()) return sprints
    return sprints.filter(sprint =>
      sprint.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [sprints, searchQuery])

  const sprintIds = useMemo(() => filteredSprints.map(s => s.id), [filteredSprints])

  const table = useReactTable({
    data: filteredSprints,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: row => row.id,
  })

  // Set up DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = sprints.findIndex((item) => item.id === active.id)
      const newIndex = sprints.findIndex((item) => item.id === over.id)
      const reordered = arrayMove(sprints, oldIndex, newIndex).map((s, i) => ({
        ...s,
        orderIndex: i + 1,
      }))

      // Optimistic update
      setSprints(reordered)

      try {
        await reorderSprints(
          reordered.map((s) => ({
            sprintId: s.id,
            orderIndex: s.orderIndex,
          }))
        )
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to persist sprint order")
        handleRefresh()
      }
    }
  }

  return (
    <div className='flex flex-col w-full gap-4 pt-4'>
      <div className='flex items-center justify-between gap-4 shrink-0'>
        <div className='relative w-full max-w-sm'>
          <Input
            placeholder="Search sprints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-muted/20"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <SearchIcon className="size-4" />
          </div>
        </div>
        <SprintDialog
          buttonText='Create Sprint'
          projectId={projectId}
          onSuccess={handleRefresh}
        />
      </div>

      <div className='w-full pb-1 overflow-y-auto max-h-[calc(100vh-320px)] min-h-100 pr-2 custom-scrollbar'>
        <div className='rounded-md border bg-card overflow-hidden shadow-sm'>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <Table>
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id} className='hover:bg-transparent'>
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id} className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                <SortableContext items={sprintIds} strategy={verticalListSortingStrategy}>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map(row => (
                      <DraggableRow
                        key={row.id}
                        row={row}
                        contributors={contributors}
                        onCreateMeeting={onCreateMeeting}
                        onRefresh={handleRefresh}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className='h-24 text-center text-muted-foreground'>
                        No sprints found. Click "Create Sprint" to add one.
                      </TableCell>
                    </TableRow>
                  )}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

export default BacklogPage
