import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Sprint } from './types'
import { DeleteDialog } from './delete-dialog'
import { AddUserStoryDialog } from './create-user-story-dialog'
import { useState } from 'react'
import { BacklogDetailsDrawer } from '@/pages/main/Projects/Backlog/BacklogDetailsPage'
import { CreateMeetingDialog } from './create-meeting-dialog'
import type { CalendarMeeting } from '@/components/project/meeting-calendar/calendar/calendar-types'

interface NestedUserStoriesProps {
  sprint: Sprint
   currentUserId: string
   onCreateMeeting: (
      meeting: Omit<CalendarMeeting, 'id' | 'color'> & { color?: string }
   ) => void
}

export function NestedUserStories({
   sprint,
   currentUserId,
   onCreateMeeting,
}: NestedUserStoriesProps) {
  const [selectedStory, setSelectedStory] = useState<any>(null)

  if (!sprint.userStories || sprint.userStories.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center border-t border-b bg-muted/10 h-32">
        <span className="text-sm text-muted-foreground mb-4">No user stories found for this sprint.</span>
        <AddUserStoryDialog />
      </div>
    )
  }

  return (
    <div className="bg-muted/10 border-y py-4 px-6 space-y-4 shadow-inner">
      <div className="space-y-2">
        {sprint.userStories.map(story => (
          <div 
             key={story.id} 
             onClick={() => setSelectedStory(story)}
             className="grid grid-cols-12 gap-4 items-center bg-background border rounded-lg p-3 shadow-sm hover:shadow-md transition-all hover:cursor-pointer"
          >
            {/* Story Details (Cols 1-4) */}
            <div className="col-span-4 flex flex-col">
              <span className="font-semibold text-sm">{story.title}</span>
              <span className="text-xs text-muted-foreground mt-0.5">
                {story.startDate} - {story.endDate} <span className="font-medium">({story.taskCount} task{story.taskCount !== 1 && 's'})</span>
              </span>
            </div>

            {/* Priority (Cols 6-7) */}
            <div className="col-span-2 flex items-center">
              <Badge variant="outline" className={
                story.priority == 'Highest' ? 'bg-red-100/50 text-red-700 border-transparent shadow-sm' :
                story.priority === 'High' ? 'bg-red-100/50 text-red-700 border-transparent shadow-sm' :
                story.priority === 'Medium' ? 'bg-yellow-100/50 text-yellow-700 border-transparent shadow-sm' :
                'bg-green-100/50 text-green-700 border-transparent shadow-sm'
              }>
                {story.priority}
              </Badge>
            </div>

            {/* Task Status Rectangles (Cols 8-10) */}
            <div className="col-span-3 flex items-center gap-1.5">
               <Tooltip>
                  <TooltipTrigger asChild>
                     <div className="flex items-center gap-1 bg-muted px-1.5 py-1 rounded-md text-xs text-muted-foreground shadow-sm" title="To Do">
                        <Circle className="h-3 w-3" />
                        <span className="font-medium">{story.taskStatuses.todo}</span>
                     </div>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                     <p>To Do: {story.taskStatuses.todo} of {story.taskCount} tasks</p>
                  </TooltipContent>
               </Tooltip>
               <Tooltip>
                  <TooltipTrigger asChild>
                     <div className="flex items-center gap-1 bg-blue-100/50 text-blue-700 px-1.5 py-1 rounded-md text-xs shadow-sm" title="In Progress">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">{story.taskStatuses.inProgress}</span>
                     </div>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                     <p>In Progress: {story.taskStatuses.inProgress} of {story.taskCount} tasks</p>
                  </TooltipContent>
               </Tooltip>
               <Tooltip>
                  <TooltipTrigger asChild>
                     <div className="flex items-center gap-1 bg-orange-100/50 text-orange-700 px-1.5 py-1 rounded-md text-xs shadow-sm" title="Standby/Blocked">
                        <AlertCircle className="h-3 w-3" />
                        <span className="font-medium">{story.taskStatuses.standby}</span>
                     </div>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                     <p>Standby/Blocked: {story.taskStatuses.standby} of {story.taskCount} tasks</p>
                  </TooltipContent>
               </Tooltip>
               <Tooltip>
                  <TooltipTrigger asChild>
                     <div className="flex items-center gap-1 bg-green-100/50 text-green-700 px-1.5 py-1 rounded-md text-xs shadow-sm" title="Done">
                        <CheckCircle2 className="h-3 w-3" />
                        <span className="font-medium">{story.taskStatuses.done}</span>
                     </div>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                     <p>Done: {story.taskStatuses.done} of {story.taskCount} tasks</p>
                  </TooltipContent>
               </Tooltip>
            </div>

            {/* Story Points (Col 10) */}
            <div className="col-span-1 flex items-center justify-center">
               <Tooltip>
                  <TooltipTrigger asChild>
                     <div className="flex items-center justify-center bg-muted/80 px-2 py-1 rounded-md text-sm shadow-sm min-w-8 border border-muted-foreground/10">
                        <span className="font-medium text-foreground">{story.storyPoints === 0 ? '-' : story.storyPoints}</span>
                     </div>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                     <p>Story points</p>
                  </TooltipContent>
               </Tooltip>
            </div>

            {/* Actions (Cols 11-12) */}
            <div className="col-span-2 flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                     <CreateMeetingDialog
                        referenceType="user_story"
                        referenceId={story.id}
                        defaultAgenda={`Meeting: ${story.title}`}
                        createdBy={currentUserId}
                        onCreateMeeting={onCreateMeeting}
                     />
              <DeleteDialog 
                itemType="User Story" 
                itemName={story.title} 
                onConfirm={() => console.log('Delete user story', story.id)} 
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Create Button */}
      <div className="pt-2 pl-1">
        <AddUserStoryDialog />
      </div>

      <BacklogDetailsDrawer 
        open={!!selectedStory} 
        onOpenChange={(open) => !open && setSelectedStory(null)}
        userStoryTitle={selectedStory?.title}
        userStoryDescription={selectedStory?.description}
        userStoryPriority={selectedStory?.priority}
        userStoryStartDate={selectedStory?.startDate}
        userStoryEndDate={selectedStory?.endDate}
        userStoryStoryPoints={selectedStory?.storyPoints}
        userStorySprintName={sprint?.name}
            currentUserId={currentUserId}
            onCreateMeeting={onCreateMeeting}
      />
    </div>
  )
}
