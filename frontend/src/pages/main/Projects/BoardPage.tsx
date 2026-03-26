import { useState, useMemo, useRef, useCallback } from 'react'
import { Search, Filter, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

import type { BoardTask, FilterState, Status } from '@/components/project/board/types'
import { FilterDialog, BoardColumn, TaskCard } from '@/components/project/board'
import type { ProjectSprint, Contributor } from '@/services/project/api-project'
import { useBoardTasks } from '@/hooks/use-board-tasks'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface BoardPageProps {
  projectSprints: ProjectSprint[]
  contributors: Contributor[]
  onRefresh: () => void
}

export default function BoardPage({ projectSprints, contributors }: BoardPageProps) {
    const {
      tasks,
      setTasks,
      sprints,
      userStories,
      loading,
      error,
      refresh,
      moveTask,
    } = useBoardTasks({ projectSprints })

    const [searchQuery, setSearchQuery] = useState('')
    const [activeTask, setActiveTask] = useState<BoardTask | null>(null)
    const [filters, setFilters] = useState<FilterState>({
        sprints: [],
        userStories: [],
        assignees: [],
        priorities: [],
        statuses: []
    })
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const dragOriginStatusRef = useRef<Status | null>(null)
    const dragCurrentStatusRef = useRef<Status | null>(null)
    const activeTaskRef = useRef<BoardTask | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        })
    )

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false
            }

            if (filters.sprints.length > 0 && !filters.sprints.includes(task.sprintId)) return false
            if (filters.userStories.length > 0 && !filters.userStories.includes(task.userStoryId)) return false
            if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) return false
            if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) return false
            if (filters.assignees.length > 0 && (!task.assignedTo || !filters.assignees.includes(task.assignedTo))) return false

            return true
        })
    }, [tasks, searchQuery, filters])

    const activeFiltersCount = 
        filters.sprints.length + 
        filters.userStories.length + 
        filters.assignees.length + 
        filters.priorities.length + 
        filters.statuses.length;

    const onDragStart = useCallback((event: DragStartEvent) => {
        const task = event.active.data.current?.task as BoardTask | undefined
        if (task) {
            activeTaskRef.current = task
            setActiveTask(task)
            dragOriginStatusRef.current = task.status
            dragCurrentStatusRef.current = task.status
        }
    }, [])

    const onDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;
    
        const activeId = active.id;
        const overId = over.id;
    
        if (activeId === overId) return;
    
        const isActiveTask = active.data.current?.type === 'Task';
        const isOverTask = over.data.current?.type === 'Task';
        const isOverColumn = over.data.current?.type === 'Column';
    
        if (!isActiveTask) return;
    
        if (isActiveTask && isOverTask) {
            setTasks((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeId);
                const overIndex = prev.findIndex((t) => t.id === overId);
                
                if (activeIndex === -1 || overIndex === -1) return prev;

                const activeTaskObj = prev[activeIndex];
                const overTaskObj = prev[overIndex];
    
                if (activeTaskObj.status !== overTaskObj.status) {
                     dragCurrentStatusRef.current = overTaskObj.status;
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
        
        if (isActiveTask && isOverColumn) {
            setTasks((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeId);
                if (activeIndex === -1) return prev;

                const overStatus = overId as Status;
    
                if (prev[activeIndex].status !== overStatus) {
                     dragCurrentStatusRef.current = overStatus;
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
    }, [setTasks])

    const onDragEnd = useCallback((_event: DragEndEvent) => {
        const task = activeTaskRef.current
        const originalStatus = dragOriginStatusRef.current
        const newStatus = dragCurrentStatusRef.current

        activeTaskRef.current = null
        setActiveTask(null)
        dragOriginStatusRef.current = null
        dragCurrentStatusRef.current = null

        if (task && originalStatus && newStatus && originalStatus !== newStatus) {
            moveTask(task.id, newStatus, originalStatus)
        }
    }, [moveTask])

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.4',
                },
            },
        }),
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline" onClick={refresh}>Retry</Button>
            </div>
        )
    }

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
                        <FilterDialog
                          filters={filters}
                          setFilters={setFilters}
                          onOpenChange={setIsFilterOpen}
                          sprints={sprints}
                          userStories={userStories}
                          contributors={contributors}
                        />
                    )}
                </Dialog>

                <div className="hidden md:flex -space-x-2 pl-4 border-l border-border ml-2">
                    {contributors.map((c) => (
                        <Avatar key={c._id} className="h-8 w-8 border-2 border-background ring-muted ring-1">
                            <AvatarFallback className="text-[10px]">{getInitials(c.fullName)}</AvatarFallback>
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
                    <BoardColumn status="ToDo" title="To Do" tasks={filteredTasks.filter(t => t.status === 'ToDo')} contributors={contributors} />
                    <BoardColumn status="InProgress" title="In Progress" tasks={filteredTasks.filter(t => t.status === 'InProgress')} contributors={contributors} />
                    <BoardColumn status="Standby" title="Standby/Blocked" tasks={filteredTasks.filter(t => t.status === 'Standby')} contributors={contributors} />
                    <BoardColumn status="Done" title="Done" tasks={filteredTasks.filter(t => t.status === 'Done')} contributors={contributors} />
                </div>
            </div>
            
            <DragOverlay dropAnimation={dropAnimation}>
                {activeTask ? <TaskCard task={activeTask} contributors={contributors} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    </div>
  )
}