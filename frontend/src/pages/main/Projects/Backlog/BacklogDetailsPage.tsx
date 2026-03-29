import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Edit2, Check, Loader2, CalendarDays } from "lucide-react"
import { format } from "date-fns"
import TaskTable from "@/components/project/backlog/tasks/task-table"
import { updateUserStory } from "@/services/project/api-user-story"
import { toast } from "sonner"
import type { Contributor } from '@/services/project/api-project'
import type { CreateMeetingInput } from '@/hooks/use-meetings'

interface BacklogDetailsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userStoryId?: string
  userStoryTitle?: string
  userStoryDescription?: string
  userStoryPriority?: string
  userStoryStartDate?: string
  userStoryEndDate?: string
  userStoryStoryPoints?: number
  userStorySprintName?: string
  sprintStartDate?: string
  sprintEndDate?: string
  contributors: Contributor[]
  onCreateMeeting: (meeting: CreateMeetingInput) => Promise<unknown> | unknown
  onRefresh?: () => void
}

export function BacklogDetailsDrawer({
  open,
  onOpenChange,
  userStoryId,
  userStoryTitle,
  userStoryDescription,
  userStoryPriority,
  userStoryStartDate,
  userStoryEndDate,
  userStoryStoryPoints,
  userStorySprintName,
  sprintStartDate,
  sprintEndDate,
  contributors,
  onCreateMeeting,
  onRefresh,
}: BacklogDetailsDrawerProps) {
  const [width, setWidth] = useState(800)
  const isResizing = useRef(false)

  const [title, setTitle] = useState("")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [description, setDescription] = useState("")
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [isSavingDetails, setIsSavingDetails] = useState(false)
  const [priority, setPriority] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [storyPoints, setStoryPoints] = useState(0)

  useEffect(() => {
    setTitle(userStoryTitle ?? "")
    setDescription(userStoryDescription ?? "")
    setPriority(userStoryPriority ?? "")
    setStartDate(userStoryStartDate ?? "")
    setEndDate(userStoryEndDate ?? "")
    setStoryPoints(userStoryStoryPoints ?? 0)
    setIsEditingTitle(false)
    setIsEditingDescription(false)
    setIsEditingDetails(false)
  }, [userStoryTitle, userStoryDescription, userStoryPriority, userStoryStartDate, userStoryEndDate, userStoryStoryPoints])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return
      const newWidth = document.documentElement.clientWidth - e.clientX
      setWidth(newWidth > 384 ? newWidth : 384)
    }
    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false
        document.body.style.cursor = 'default'
        document.body.style.userSelect = 'auto'
      }
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }

  const saveField = useCallback(async (fields: Record<string, unknown>) => {
    if (!userStoryId) return false
    try {
      await updateUserStory(userStoryId, fields)
      onRefresh?.()
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to update user story")
      return false
    }
  }, [userStoryId, onRefresh])

  const handleTitleBlur = async () => {
    setIsEditingTitle(false)
    const trimmed = title.trim()
    if (!trimmed || trimmed.length < 3) {
      toast.error("Story name must be at least 3 characters")
      setTitle(userStoryTitle ?? "")
      return
    }
    if (trimmed !== userStoryTitle) {
      const ok = await saveField({ storyName: trimmed })
      if (!ok) setTitle(userStoryTitle ?? "")
    }
  }

  const handleDescriptionBlur = async () => {
    setIsEditingDescription(false)
    if (description !== (userStoryDescription ?? "")) {
      const ok = await saveField({ description })
      if (!ok) setDescription(userStoryDescription ?? "")
    }
  }

  const handleDetailsSave = async () => {
    if (!startDate || !endDate) {
      toast.error("Start date and due date are required")
      return
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("Due date must be after start date")
      return
    }
    if (sprintStartDate && new Date(startDate) < new Date(sprintStartDate)) {
      toast.error("Start date cannot be before the sprint start date")
      return
    }
    if (sprintEndDate && new Date(endDate) > new Date(sprintEndDate)) {
      toast.error("Due date cannot be after the sprint end date")
      return
    }
    if (storyPoints < 0) {
      toast.error("Story points cannot be negative")
      return
    }
    setIsSavingDetails(true)
    const ok = await saveField({
      priority,
      startDate,
      dueDate: endDate,
      storyPointEstimate: storyPoints,
    })
    setIsSavingDetails(false)
    if (ok) {
      setIsEditingDetails(false)
      toast.success("Details updated")
    }
  }

  const handleDetailsCancel = () => {
    setPriority(userStoryPriority ?? "")
    setStartDate(userStoryStartDate ?? "")
    setEndDate(userStoryEndDate ?? "")
    setStoryPoints(userStoryStoryPoints ?? 0)
    setIsEditingDetails(false)
  }

  const formatDateDisplay = (iso: string) => {
    try { return format(new Date(iso), "PPP") } catch { return iso || "Pick a date" }
  }

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent style={{ maxWidth: '100vw', width: `${width}px` }}>
        {/* Resize Handle */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-primary/20 transition-all z-50 flex items-center justify-center group"
          onMouseDown={handleMouseDown}
        >
          <div className="h-8 w-1 rounded-full bg-border group-hover:bg-primary transition-colors" />
        </div>
        <div className="no-scrollbar overflow-y-auto p-4">
          <DrawerHeader>
            <DrawerTitle>
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleBlur()}
                  autoFocus
                  className="text-2xl font-bold h-auto py-2 px-1 w-auto"
                />
              ) : (
                <h1
                  onClick={() => setIsEditingTitle(true)}
                  className="text-2xl font-bold hover:bg-muted/50 p-1 -ml-1 rounded cursor-pointer transition-colors"
                >
                  {title || "Untitled"}
                </h1>
              )}
            </DrawerTitle>
            <DrawerDescription>
              {isEditingDescription ? (
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleDescriptionBlur}
                  autoFocus
                  className="min-h-25 w-full"
                />
              ) : (
                <p
                  onClick={() => setIsEditingDescription(true)}
                  className="text-muted-foreground hover:bg-muted/50 p-2 -ml-2 rounded cursor-pointer transition-colors whitespace-pre-wrap"
                >
                  {description || "Add a description..."}
                </p>
              )}
            </DrawerDescription>
          </DrawerHeader>

          {/* ── Details panel ──────────────────────────────────────────── */}
          <div className="mt-2 border rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b">
              <span className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">Details</span>
              <div className="flex items-center gap-1">
                {isEditingDetails ? (
                  <>
                    <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs text-muted-foreground" onClick={handleDetailsCancel} disabled={isSavingDetails}>
                      Cancel
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs" onClick={handleDetailsSave} disabled={isSavingDetails}>
                      {isSavingDetails ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => setIsEditingDetails(true)}>
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </Button>
                )}
              </div>
            </div>
            <div className="divide-y">
              {/* Sprint Name — always read-only */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-xs font-medium text-muted-foreground w-32 shrink-0">Sprint</span>
                <Input value={userStorySprintName ?? ""} disabled className="h-8 text-sm bg-muted/30 cursor-not-allowed" />
              </div>
              {/* Priority */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-xs font-medium text-muted-foreground w-32 shrink-0">Priority</span>
                <Select value={priority} onValueChange={setPriority} disabled={!isEditingDetails}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lowest">Lowest</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="highest">Highest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Start Date */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-xs font-medium text-muted-foreground w-32 shrink-0">Start Date</span>
                {isEditingDetails ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 text-sm justify-start font-normal flex-1 gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                        {startDate ? formatDateDisplay(startDate) : "Pick a start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate ? new Date(startDate) : undefined}
                        onSelect={(d) => setStartDate(d?.toISOString() || "")}
                        disabled={[
                          ...(sprintStartDate ? [{ before: new Date(sprintStartDate) }] : []),
                          ...(sprintEndDate ? [{ after: new Date(sprintEndDate) }] : []),
                        ]}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="flex items-center gap-2 h-8 text-sm text-foreground">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                    {startDate ? formatDateDisplay(startDate) : "—"}
                  </div>
                )}
              </div>
              {/* Due Date */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-xs font-medium text-muted-foreground w-32 shrink-0">Due Date</span>
                {isEditingDetails ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 text-sm justify-start font-normal flex-1 gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                        {endDate ? formatDateDisplay(endDate) : "Pick a due date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate ? new Date(endDate) : undefined}
                        onSelect={(d) => setEndDate(d?.toISOString() || "")}
                        disabled={[
                          ...(sprintStartDate ? [{ before: new Date(sprintStartDate) }] : []),
                          ...(sprintEndDate ? [{ after: new Date(sprintEndDate) }] : []),
                        ]}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="flex items-center gap-2 h-8 text-sm text-foreground">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                    {endDate ? formatDateDisplay(endDate) : "—"}
                  </div>
                )}
              </div>
              {/* Story Points */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-xs font-medium text-muted-foreground w-32 shrink-0">Story Points</span>
                <Input
                  type="number"
                  min={0}
                  value={storyPoints}
                  onChange={(e) => setStoryPoints(Number(e.target.value))}
                  disabled={!isEditingDetails}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* ── Tasks ─────────────────────────────────────────────────── */}
          {userStoryId && (
            <TaskTable
              userStoryId={userStoryId}
              contributors={contributors}
              onCreateMeeting={onCreateMeeting}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}