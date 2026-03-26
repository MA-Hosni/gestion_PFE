import { CreateNewProject } from "@/components/project/create-project"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import {
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { ArrowRight, CalendarIcon, Loader2 } from "lucide-react"
import { getStudentProject, getProjectProgress, type Project } from "@/services/project/api-project"

// Helper to get initials
function getInitials(name: string) {
  if (!name) return "UN"
  const parts = name.split(" ")
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

export default function ProjectsPage() {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const projectData = await getStudentProject()
        if (projectData) {
          setProject(projectData)
          // Fetch progress
          if (projectData.projectId) {
             const progressData = await getProjectProgress(projectData.projectId)
             if (progressData && progressData.projectProgress) {
               setProgress(progressData.projectProgress.progress || 0)
             }
          }
        }
      } catch (error) {
        console.error("Failed to load project:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 py-12">
        <h2 className="text-2xl font-semibold">No Projects Yet</h2>
        <p className="text-muted-foreground">
          Get started by creating your first project.
        </p>
        <CreateNewProject />
      </div>
    )
  }

  const startDate = new Date(project.startDate)
  const endDate = new Date(project.endDate)
  const completionPercentage = progress

  const chartData = [
    { activity: "completed", value: completionPercentage, fill: "var(--color-completed)" },
  ]
  const chartConfig = {
    completed: {
      label: "Completed",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  const visibleContributors = project.contributors.slice(0, 4)
  const extraContributorsCount = project.contributors.length - 4

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 w-full h-80">
      <Card 
        className="flex flex-col transition-all hover:shadow-lg hover:cursor-pointer" 
        onClick={() => navigate(`/projects/${project.projectId}`)}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1 pr-4">
            <CardTitle className="text-lg font-bold">{project.title}</CardTitle>
            <CardDescription className="line-clamp-3 text-sm">
                {project.description || "No description provided."}
            </CardDescription>
          </div>
          <div className="shrink-0">
            <ChartContainer
              config={chartConfig}
              className="aspect-square h-12.5 w-12.5"
            >
              <RadialBarChart
                data={chartData}
                startAngle={90}
                endAngle={90 + (completionPercentage * 360) / 100}
                innerRadius={18}
                outerRadius={24}
              >
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground text-[10px] font-bold"
                          >
                            {completionPercentage}%
                          </text>
                        )
                      }
                    }}
                  />
                </PolarRadiusAxis>
                <RadialBar
                  dataKey="value"
                  background
                  cornerRadius={10}
                  className="fill-primary"
                />
              </RadialBarChart>
            </ChartContainer>
            <div className="text-center text-[10px] font-bold text-muted-foreground mt-1">
                completed
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-auto pt-4">
            <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground w-fit">
              <CalendarIcon className="size-3.5" />
              <span>{format(startDate, "MMM d, yyyy")}</span>
              <ArrowRight className="size-3 opacity-50" />
              <span>{format(endDate, "MMM d, yyyy")}</span>
            </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/5 py-3">
          <div className="flex -space-x-2 hover:space-x-1 transition-all duration-200">
            {visibleContributors.map((c, index) => (
              <Avatar
                key={c._id || index}
                title={c.fullName}
                className="size-7 border-2 border-background transition-transform hover:scale-110 hover:z-10 bg-muted flex items-center justify-center text-xs font-semibold"
              >
                <AvatarFallback className="text-[10px]">
                  {getInitials(c.fullName)}
                </AvatarFallback>
              </Avatar>
            ))}
            {extraContributorsCount > 0 && (
              <div className="flex size-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground hover:z-10 hover:bg-muted/80">
                  +{extraContributorsCount}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
