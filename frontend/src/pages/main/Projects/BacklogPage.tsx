import { useState, Fragment, useMemo } from 'react'
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
import {
  mockSprints as initialSprints,
  sprintColumns,
  NestedUserStories,
  AddSprintDialog,
  type Sprint
} from '@/components/project/backlog'

// Draggable Table Row Component
function DraggableRow({ row }: { row: Row<Sprint> }) {
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
              cell.column.id === 'expander' ? 'w-[40px] px-2' : '',
              cell.column.id === 'drag-handle' ? 'w-[40px] px-1' : ''
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
            <NestedUserStories sprint={row.original} />
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  )
}

const BacklogPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints)
  const [expanded, setExpanded] = useState<ExpandedState>(true)

  const filteredSprints = useMemo(() => {
    if (!searchQuery.trim()) return sprints
    return sprints.filter(sprint => 
      sprint.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [sprints, searchQuery])

  const sprintIds = useMemo(() => filteredSprints.map(s => s.id), [filteredSprints])

  const table = useReactTable({
    data: filteredSprints,
    columns: sprintColumns,
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
        distance: 2, // Helps prevent firing drag when just clicking
      },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSprints((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        // Move the item
        const reorderedSprints = arrayMove(items, oldIndex, newIndex)
        
        // Re-assign sprint orders according to the new visual order
        return reorderedSprints.map((sprint, index) => ({
          ...sprint,
          order: index + 1
        }))
      })
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
        <AddSprintDialog />
      </div>
      
      <div className='w-full pb-1 overflow-y-auto max-h-[calc(100vh-320px)] min-h-[400px] pr-2 custom-scrollbar'>
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
                      <DraggableRow key={row.id} row={row} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={sprintColumns.length} className='h-24 text-center text-muted-foreground'>
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
