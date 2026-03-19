import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task, Status } from './types'
import { TaskCard } from './TaskCard'

interface BoardColumnProps {
  title: string
  tasks: Task[]
  status: Status
}

export function BoardColumn({ title, tasks, status }: BoardColumnProps) {
    const { setNodeRef } = useSortable({
        id: status,
        data: {
          type: 'Column',
        },
    });

    const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

    return (
        <div className="flex-1 min-w-[280px] max-w-[320px] flex flex-col bg-muted/30 rounded-lg p-2 h-full">
            <div className="flex items-center justify-between px-2 mb-3 mt-1">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    {title}
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold text-muted-foreground bg-gray-200">
                        {tasks.length}
                    </Badge>
                </h3>
            </div>
            
            <div ref={setNodeRef} className="flex-1 overflow-y-auto px-1 scrollbar-thin rounded-md">
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                    {/* Invisible drop zone placeholder to keep the column droppable when empty */}
                    <div className="h-full w-full border-2 border-transparent"></div>
                </SortableContext>
            </div>
        </div>
    )
}
