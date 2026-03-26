import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CalendarPage from './Calendar/CalendarPage'
import BoardPage from './BoardPage'
import ContributorsPage from './ContributorsPage'
import BacklogPage from './Backlog/BacklogPage'
import ReportsPage from './ReportsPage'
import { Button } from '@/components/ui/button'
import { CalendarDays, ClipboardPenLine, Loader2 } from 'lucide-react'
import type { CalendarMeeting } from '@/components/project/meeting-calendar/calendar/calendar-types'
import { getStudentProject, updateProjectDetails, type Project } from '@/services/project/api-project'
import { useAuth } from '@/context/auth-context'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { generateProjectReport } from '@/services/project/api-report'
import { generateHTMLReport } from '@/lib/report-generator'

// Placeholder components - replaced with actual components later
const Summary = () => <div className="p-4 border rounded-lg bg-muted/20 h-96 flex items-center justify-center">Summary Component</div>

function ProjectDetailsPage() {
  const { projectId } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState("")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  
  const [description, setDescription] = useState("")
  const [isEditingDescription, setIsEditingDescription] = useState(false)

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isEditingDates, setIsEditingDates] = useState(false)
  
  const [meetings, setMeetings] = useState<CalendarMeeting[]>([])

  const { user } = useAuth()
  const currentUserId = user?.id ?? ''

  const loadProject = async () => {
    try {
      setLoading(true)
      const data = await getStudentProject()
      if (data && (projectId ? data.projectId === projectId : true)) {
        setProject(data)
        setTitle(data.title)
        setDescription(data.description)
        setStartDate(data.startDate)
        setEndDate(data.endDate)
      }
    } catch (err) {
      console.error("Failed to load project details:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProject()
  }, [projectId])

  const handleUpdate = async (fields?: { title?: string; description?: string; startDate?: string; endDate?: string }) => {
    if (!project) return
    const payload = fields ?? { title, description, startDate, endDate }

    // Build only changed fields
    const changes: Record<string, string> = {}
    if (payload.title !== undefined && payload.title !== project.title) changes.title = payload.title
    if (payload.description !== undefined && payload.description !== project.description) changes.description = payload.description
    if (payload.startDate !== undefined && payload.startDate !== project.startDate) changes.startDate = payload.startDate
    if (payload.endDate !== undefined && payload.endDate !== project.endDate) changes.endDate = payload.endDate

    if (Object.keys(changes).length === 0) return

    try {
      await updateProjectDetails(changes)
      setProject({ ...project, ...changes })
    } catch (error: any) {
      console.error("Update failed", error)
      toast.error(error?.response?.data?.error || error?.response?.data?.message || "Failed to update project")
      // Revert to last known good state
      setTitle(project.title)
      setDescription(project.description)
      setStartDate(project.startDate)
      setEndDate(project.endDate)
    }
  }

  // ── Title blur ──
  const onBlurTitle = () => {
    setIsEditingTitle(false)
    if (!title.trim()) {
      toast.error("Title cannot be empty")
      setTitle(project?.title ?? "")
      return
    }
    handleUpdate({ title })
  }

  // ── Description blur ──
  const onBlurDescription = () => {
    setIsEditingDescription(false)
    handleUpdate({ description })
  }

  // ── Dates blur / save ──
  const saveDates = () => {
    setIsEditingDates(false)
    if (!startDate || !endDate) {
      toast.error("Start date and end date are required")
      setStartDate(project?.startDate ?? "")
      setEndDate(project?.endDate ?? "")
      return
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date must be after start date")
      setStartDate(project?.startDate ?? "")
      setEndDate(project?.endDate ?? "")
      return
    }
    handleUpdate({ startDate, endDate })
  }

  const formatDisplayDate = (iso: string) => {
    try { return format(new Date(iso), 'MMM dd, yyyy') } catch { return iso }
  }

  if (loading) {
     return (
        <div className="flex w-full items-center justify-center p-12">
            <Loader2 className="animate-spin text-muted-foreground mr-2 h-6 w-6"/>
        </div>
     )
  }

  if (!project) {
     return <div className="p-12 text-center text-muted-foreground">Project not found or access denied.</div>
  }

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 w-full">
        <div className="flex items-center justify-between">
          {isEditingTitle ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={onBlurTitle}
              onKeyDown={(e) => {
                 if (e.key === "Enter") {
                    (e.target as HTMLInputElement).blur()
                 }
              }}
              autoFocus
              className="text-2xl font-bold h-auto py-2 px-1 w-auto"
            />
          ) : (
            <h1 
              onClick={() => setIsEditingTitle(true)}
              className="text-2xl font-bold hover:bg-muted/50 p-1 -ml-1 rounded cursor-pointer transition-colors"
              title="Click to edit project title"
            >
              {title}
            </h1>
          )}
          <Button 
            variant="outline"
            onClick={async () => {
              if (!project) return;
              try {
                const toastId = toast.loading("Generating report...");
                const report = await generateProjectReport(project.projectId);
                generateHTMLReport(report as any, 'Project');
                toast.success("Report generated successfully", { id: toastId });
              } catch (error: any) {
                toast.error(error?.response?.data?.message || "Failed to generate report");
              }
            }}
          >
            <ClipboardPenLine className="mr-2 h-4 w-4" /> Generate Report
          </Button>
        </div>

        {/* Date Range */}
        {isEditingDates ? (
          <div className="flex items-center gap-3 px-1">
            <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              type="date"
              value={startDate ? startDate.slice(0, 10) : ''}
              onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
              autoFocus
              className="h-8 text-sm w-40"
            />
            <span className="text-muted-foreground text-sm">—</span>
            <Input
              type="date"
              value={endDate ? endDate.slice(0, 10) : ''}
              onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="h-8 text-sm w-40"
            />
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={saveDates}>
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-xs text-muted-foreground"
              onClick={() => {
                setStartDate(project?.startDate ?? '')
                setEndDate(project?.endDate ?? '')
                setIsEditingDates(false)
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingDates(true)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:bg-muted/50 px-1 py-1.5 -ml-1 rounded cursor-pointer transition-colors w-fit"
            title="Click to edit project dates"
          >
            <CalendarDays className="h-4 w-4" />
            <span>{formatDisplayDate(startDate)}</span>
            <span>—</span>
            <span>{formatDisplayDate(endDate)}</span>
          </div>
        )}

        {isEditingDescription ? (
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={onBlurDescription}
            autoFocus
            className="min-h-25 w-full"
          />
        ) : (
          <p 
            onClick={() => setIsEditingDescription(true)}
            className="text-muted-foreground hover:bg-muted/50 p-2 -ml-2 rounded cursor-pointer transition-colors whitespace-pre-wrap"
            title="Click to edit project description"
          >
            {description || "Add a description..."}
          </p>
        )}
      </div>

      <Tabs defaultValue="Backlog" className="w-full">
        <TabsList variant="line" className="w-full border-b h-auto">
          <TabsTrigger value="Summary">Summary</TabsTrigger>
          <TabsTrigger value="Backlog">Backlog</TabsTrigger>
          <TabsTrigger value="Contributors">Contributors</TabsTrigger>
          <TabsTrigger value="Board">Board</TabsTrigger>
          <TabsTrigger value="Calendar">Calendar</TabsTrigger>
          <TabsTrigger value="Reports">Reports</TabsTrigger>
        </TabsList>
        <div className="max-w-full overflow-x-auto mt-4">
          <TabsContent value="Summary"><Summary /></TabsContent>
          <TabsContent value="Backlog">
            <BacklogPage
              currentUserId={currentUserId}
              contributors={project.contributors}
              projectSprints={project.sprints}
              projectId={project.projectId}
              onRefresh={loadProject}
              onCreateMeeting={(meeting) =>
                setMeetings((prev) => [
                  ...prev,
                  {
                    ...meeting,
                    id: crypto.randomUUID(),
                    color: meeting.color ?? 'blue',
                  },
                ])
              }
            />
          </TabsContent>
          <TabsContent value="Contributors">
             <ContributorsPage project={project} setProject={setProject} />
          </TabsContent>
          <TabsContent value="Board">
              <BoardPage
                projectSprints={project.sprints}
                contributors={project.contributors}
                onRefresh={loadProject}
              />
          </TabsContent>
          <TabsContent value="Calendar">
            <CalendarPage meetings={meetings} setMeetings={setMeetings} />
          </TabsContent>
          <TabsContent value="Reports"><ReportsPage /></TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default ProjectDetailsPage