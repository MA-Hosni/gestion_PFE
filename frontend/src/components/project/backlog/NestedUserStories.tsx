import { Plus, MoreHorizontal, Edit2, Trash2, CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Sprint } from './types'

interface NestedUserStoriesProps {
  sprint: Sprint
}

export function NestedUserStories({ sprint }: NestedUserStoriesProps) {
  if (!sprint.userStories || sprint.userStories.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center border-t border-b bg-muted/10 h-32">
        <span className="text-sm text-muted-foreground mb-4">No user stories found for this sprint.</span>
        <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Create User Story
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-muted/10 border-y py-4 px-6 space-y-4 shadow-inner">
      <div className="space-y-2">
        {sprint.userStories.map(story => (
          <div key={story.id} className="grid grid-cols-12 gap-4 items-center bg-background border rounded-lg p-3 shadow-sm hover:shadow-md transition-all">
            {/* Story Details (Cols 1-5) */}
            <div className="col-span-5 flex flex-col">
              <span className="font-semibold text-sm">{story.title}</span>
              <span className="text-xs text-muted-foreground mt-0.5">
                {story.startDate} - {story.endDate} <span className="font-medium">({story.taskCount} task{story.taskCount !== 1 && 's'})</span>
              </span>
            </div>

            {/* Priority (Cols 6-7) */}
            <div className="col-span-2 flex items-center">
              <Badge variant="outline" className={
                story.priority === 'High' ? 'bg-red-100/50 text-red-700 border-transparent shadow-sm' :
                story.priority === 'Medium' ? 'bg-yellow-100/50 text-yellow-700 border-transparent shadow-sm' :
                'bg-green-100/50 text-green-700 border-transparent shadow-sm'
              }>
                {story.priority}
              </Badge>
            </div>

            {/* Task Status Rectangles (Cols 8-10) */}
            <div className="col-span-3 flex items-center gap-1.5">
               <div className="flex items-center gap-1 bg-muted px-1.5 py-1 rounded-md text-xs text-muted-foreground shadow-sm" title="To Do">
                  <Circle className="h-3 w-3" />
                  <span className="font-medium">{story.taskStatuses.todo}</span>
               </div>
               <div className="flex items-center gap-1 bg-blue-100/50 text-blue-700 px-1.5 py-1 rounded-md text-xs shadow-sm" title="In Progress">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">{story.taskStatuses.inProgress}</span>
               </div>
               <div className="flex items-center gap-1 bg-orange-100/50 text-orange-700 px-1.5 py-1 rounded-md text-xs shadow-sm" title="Standby/Blocked">
                  <AlertCircle className="h-3 w-3" />
                  <span className="font-medium">{story.taskStatuses.standby}</span>
               </div>
               <div className="flex items-center gap-1 bg-green-100/50 text-green-700 px-1.5 py-1 rounded-md text-xs shadow-sm" title="Done">
                  <CheckCircle2 className="h-3 w-3" />
                  <span className="font-medium">{story.taskStatuses.done}</span>
               </div>
            </div>

            {/* Actions (Cols 11-12) */}
            <div className="col-span-2 flex items-center justify-end gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Create Button */}
      <div className="pt-2 pl-1">
        <Button size="sm" variant="outline" className="gap-2 shadow-sm bg-background border-dashed">
            <Plus className="h-4 w-4" />
            Create User Story
        </Button>
      </div>
    </div>
  )
}
