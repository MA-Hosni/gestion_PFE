import { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  defaultDropAnimationSideEffects,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type DropAnimation,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import { 
  type Task, 
  type FilterState, 
  type Status, 
  initialTasks, 
  users, 
  FilterDialog, 
  BoardColumn, 
  TaskCard 
} from '@/components/project/board'

export default function BoardPage() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        sprints: [],
        userStories: [],
        assignees: [],
        priorities: [],
        statuses: []
    })
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Dnd Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // Prevent accidental drags
            },
        })
    );

    // Derived filtered tasks
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            // 1. Text Search (Title)
            if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false
            }

            // 2. Filters
            if (filters.sprints.length > 0 && !filters.sprints.includes(task.sprintId)) return false
            if (filters.userStories.length > 0 && !filters.userStories.includes(task.userStoryId)) return false
            if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) return false
            if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) return false
            if (filters.assignees.length > 0 && !filters.assignees.includes(task.assigneeId)) return false

            return true
        })
    }, [tasks, searchQuery, filters])

    const activeFiltersCount = 
        filters.sprints.length + 
        filters.userStories.length + 
        filters.assignees.length + 
        filters.priorities.length + 
        filters.statuses.length;

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task);
        }
    }    

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;
    
        const activeId = active.id;
        const overId = over.id;
    
        if (activeId === overId) return;
    
        const isActiveTask = active.data.current?.type === 'Task';
        const isOverTask = over.data.current?.type === 'Task';
        const isOverColumn = over.data.current?.type === 'Column';
    
        if (!isActiveTask) return;
    
        // Dragging over another Task
        if (isActiveTask && isOverTask) {
            setTasks((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeId);
                const overIndex = prev.findIndex((t) => t.id === overId);
                
                const activeTaskObj = prev[activeIndex];
                const overTaskObj = prev[overIndex];
                
                if (!activeTaskObj || !overTaskObj) return prev;
    
                if (activeTaskObj.status !== overTaskObj.status) {
                     const updatedTasks = [...prev];
                     updatedTasks[activeIndex] = { 
                         ...activeTaskObj, 
                         status: overTaskObj.status 
                     };
                     return arrayMove(updatedTasks, activeIndex, overIndex); 
                }
                
                return arrayMove(prev, activeIndex, overIndex); 
            });
        }
        
        // Dragging over an empty Column area
        if (isActiveTask && isOverColumn) {
            setTasks((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeId);
                const overStatus = overId as Status;
    
                if (prev[activeIndex].status !== overStatus) {
                     const updatedTasks = [...prev];
                     updatedTasks[activeIndex] = { 
                         ...updatedTasks[activeIndex], 
                         status: overStatus 
                     };
                     return arrayMove(updatedTasks, activeIndex, activeIndex); 
                }
                return prev;
            });
        }
    }    

    function onDragEnd(event: DragEndEvent) {
        setActiveTask(null);
    }

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.4',
                },
            },
        }),
    };

  return (
    <div className="flex flex-col max-h-150">
        {/* Header: Search & Filter */}
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4 w-full">
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        className="pl-9 bg-muted/40 border-muted-foreground/20 h-9" 
                        placeholder="Search tasks by title..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className={`h-9 gap-2 ${activeFiltersCount > 0 ? 'bg-primary/10 border-primary/50 text-primary hover:bg-primary/20' : ''}`}>
                            <Filter className="h-4 w-4" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-primary text-primary-foreground min-w-5 justify-center">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>
                    </DialogTrigger>
                    {isFilterOpen && (
                        <FilterDialog filters={filters} setFilters={setFilters} onOpenChange={setIsFilterOpen} />
                    )}
                </Dialog>

                <div className="hidden md:flex -space-x-2 pl-4 border-l border-border ml-2">
                    {users.map((u, i) => (
                        <Avatar key={i} className="h-8 w-8 border-2 border-background ring-muted ring-1">
                            <AvatarImage src={u.avatar} />
                            <AvatarFallback>{u.initials}</AvatarFallback>
                        </Avatar>
                    ))}
                </div>
            </div>
        </div>

        {/* Board Columns */}
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >
            <div className="flex-1 overflow-x-auto p-4 h-[calc(100vh-140px)]">
                <div className="flex h-full gap-2 justify-between w-full">
                    <BoardColumn status="ToDo" title="To Do" tasks={filteredTasks.filter(t => t.status === 'ToDo')} />
                    <BoardColumn status="InProgress" title="In Progress" tasks={filteredTasks.filter(t => t.status === 'InProgress')} />
                    <BoardColumn status="Standby" title="Standby/Blocked" tasks={filteredTasks.filter(t => t.status === 'Standby')} />
                    <BoardColumn status="Done" title="Done" tasks={filteredTasks.filter(t => t.status === 'Done')} />
                </div>
            </div>
            
            <DragOverlay dropAnimation={dropAnimation}>
                {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    </div>
  )
}