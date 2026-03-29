import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import CalendarPage from "./CalendarPage"
import BoardPage from "./BoardPage"
import ContributorsPage from "./ContributorsPage"
import BacklogPage from "./Backlog/BacklogPage"
import ReportsPage from "./ReportsPage"
import DashboardPage from "./DashboardPage"
import { Button } from "@/components/ui/button"
import { CalendarDays, ClipboardPenLine, Loader2 } from "lucide-react"
import {
  getStudentProject,
  updateProjectDetails,
  type Project,
} from "@/services/project/api-project"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import { format } from "date-fns"
import { generateProjectReport } from "@/services/project/api-report"
import { generateHTMLReport } from "@/lib/report-generator"
import { useMeetings } from "@/hooks/use-meetings"

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

  const { user } = useAuth()
  const currentUserId = user?.id ?? ""

  const { meetings, setMeetings, createMeeting, updateMeeting, deleteMeeting } =
    useMeetings({ currentUserId, projectId: project?.projectId })

  const enrichedMeetings = useMemo(() => {
    return meetings.map((meeting) => {
      let referenceTitle = meeting.referenceId
      let createdByName = meeting.createdBy

      const userId = user?.id || (user as any)?._id
      const profileId = user?.profile?.id || user?.profile?._id;

      if (meeting.createdBy === userId || meeting.createdBy === profileId) {
        createdByName = user?.fullName || meeting.createdBy
      } else {
        const contributor = project?.contributors?.find(
          (c) =>
            c._id === meeting.createdBy || (c as any).id === meeting.createdBy
        )
        if (contributor) {
          createdByName = contributor.fullName
        }
      }

      if (meeting.agenda && meeting.agenda.startsWith("Meeting: ")) {
        const extracted = meeting.agenda.replace(/^Meeting: /, "")
        referenceTitle = extracted || referenceTitle
      }

      return { ...meeting, referenceTitle, createdByName }
    })
  }, [meetings, project, user])

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

  const handleUpdate = async (fields?: {
    title?: string
    description?: string
    startDate?: string
    endDate?: string
  }) => {
    if (!project) return
    const payload = fields ?? { title, description, startDate, endDate }

    const changes: Record<string, string> = {}
    if (payload.title !== undefined && payload.title !== project.title)
      changes.title = payload.title
    if (
      payload.description !== undefined &&
      payload.description !== project.description
    )
      changes.description = payload.description
    if (
      payload.startDate !== undefined &&
      payload.startDate !== project.startDate
    )
      changes.startDate = payload.startDate
    if (payload.endDate !== undefined && payload.endDate !== project.endDate)
      changes.endDate = payload.endDate

    if (Object.keys(changes).length === 0) return

    try {
      await updateProjectDetails(changes)
      setProject({ ...project, ...changes })
    } catch (error: any) {
      console.error("Update failed", error)
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to update project"
      )

      setTitle(project.title)
      setDescription(project.description)
      setStartDate(project.startDate)
      setEndDate(project.endDate)
    }
  }

  const onBlurTitle = () => {
    setIsEditingTitle(false)
    if (!title.trim()) {
      toast.error("Title cannot be empty")
      setTitle(project?.title ?? "")
      return
    }
    handleUpdate({ title })
  }

  const onBlurDescription = () => {
    setIsEditingDescription(false)
    handleUpdate({ description })
  }

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
    try {
      return format(new Date(iso), "MMM dd, yyyy")
    } catch {
      return iso
    }
  }

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-12">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        Project not found or access denied.
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          {isEditingTitle ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={onBlurTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  ;(e.target as HTMLInputElement).blur()
                }
              }}
              autoFocus
              className="h-auto w-auto px-1 py-2 text-2xl font-bold"
            />
          ) : (
            <h1
              onClick={() => setIsEditingTitle(true)}
              className="-ml-1 cursor-pointer rounded p-1 text-2xl font-bold transition-colors hover:bg-muted/50"
              title="Click to edit project title"
            >
              {title}
            </h1>
          )}
          <Button
            variant="outline"
            onClick={async () => {
              if (!project) return
              try {
                const toastId = toast.loading("Generating report...")
                const report = await generateProjectReport(project.projectId)
                generateHTMLReport(report as any, "Project")
                toast.success("Report generated successfully", { id: toastId })
              } catch (error: any) {
                toast.error(
                  error?.response?.data?.message || "Failed to generate report"
                )
              }
            }}
          >
            <ClipboardPenLine className="mr-2 h-4 w-4" /> Generate Report
          </Button>
        </div>

        {/* Date Range */}
        {isEditingDates ? (
          <div className="flex items-center gap-3 px-1">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              type="date"
              value={startDate ? startDate.slice(0, 10) : ""}
              onChange={(e) =>
                setStartDate(
                  e.target.value ? new Date(e.target.value).toISOString() : ""
                )
              }
              autoFocus
              className="h-8 w-40 text-sm"
            />
            <span className="text-sm text-muted-foreground">—</span>
            <Input
              type="date"
              value={endDate ? endDate.slice(0, 10) : ""}
              onChange={(e) =>
                setEndDate(
                  e.target.value ? new Date(e.target.value).toISOString() : ""
                )
              }
              className="h-8 w-40 text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={saveDates}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-xs text-muted-foreground"
              onClick={() => {
                setStartDate(project?.startDate ?? "")
                setEndDate(project?.endDate ?? "")
                setIsEditingDates(false)
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingDates(true)}
            className="-ml-1 flex w-fit cursor-pointer items-center gap-2 rounded px-1 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
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
            className="-ml-2 cursor-pointer rounded p-2 whitespace-pre-wrap text-muted-foreground transition-colors hover:bg-muted/50"
            title="Click to edit project description"
          >
            {description || "Add a description..."}
          </p>
        )}
      </div>

      <Tabs defaultValue="Backlog" className="w-full">
        <TabsList variant="line" className="h-auto w-full border-b">
          <TabsTrigger value="Summary">Summary</TabsTrigger>
          <TabsTrigger value="Backlog">Backlog</TabsTrigger>
          <TabsTrigger value="Contributors">Contributors</TabsTrigger>
          <TabsTrigger value="Board">Board</TabsTrigger>
          <TabsTrigger value="Calendar">Calendar</TabsTrigger>
          <TabsTrigger value="Reports">Reports</TabsTrigger>
        </TabsList>
        <div className="mt-4 max-w-full overflow-x-auto">
          <TabsContent value="Summary">
            <DashboardPage
              projectId={project.projectId}
              contributors={project.contributors}
            />
          </TabsContent>
          <TabsContent value="Backlog">
            <BacklogPage
              contributors={project.contributors}
              projectSprints={project.sprints}
              projectId={project.projectId}
              onRefresh={loadProject}
              onCreateMeeting={createMeeting}
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
            <CalendarPage
              meetings={enrichedMeetings}
              setMeetings={setMeetings}
              onUpdateMeeting={updateMeeting}
              onDeleteMeeting={deleteMeeting}
            />
          </TabsContent>
          <TabsContent value="Reports">
            <ReportsPage onCreateMeeting={createMeeting} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default ProjectDetailsPage
