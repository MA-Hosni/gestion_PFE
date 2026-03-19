import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from './types'
import { users } from './mockData'

interface TaskCardProps {
  task: Task
  isOverlay?: boolean
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const priorityColor = {
        Low: 'bg-green-100 text-green-700 hover:bg-green-100/80',
        Medium: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80',
        High: 'bg-red-100 text-red-700 hover:bg-red-100/80',
    }[task.priority]

    const assignee = users.find(u => u.id === task.assigneeId)

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30 p-2"
            >
                <div className="h-32 rounded-lg border bg-background/50 border-dashed border-primary" />
            </div>
        )
    }

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            className="touch-none pb-2"
        >
            <Card 
                className={`shadow-sm border border-border hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${isOverlay ? 'cursor-grabbing ring-2 ring-primary/20 rotate-2' : ''}`}
            >
                <CardHeader className="py-0">
                    <CardTitle className="text-sm font-medium leading-tight select-none">
                        {task.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 text-xs text-muted-foreground line-clamp-2 select-none">
                    {task.description}
                </CardContent>
                <CardFooter className="flex justify-end py-2">
                    <div className="flex justify-between items-center w-full">
                        {assignee && (
                            <Avatar className="h-7 w-7 border border-background">
                                <AvatarImage src={assignee.avatar} />
                                <AvatarFallback className="text-[9px]">{assignee.initials}</AvatarFallback>
                            </Avatar>
                        )}
                        <Badge variant="outline" className={`px-1.5 py-0 text-[10px] font-semibold border-0 ${priorityColor}`}>
                            {task.priority}
                        </Badge>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
