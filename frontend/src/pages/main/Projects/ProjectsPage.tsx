import { CreateNewProject } from "@/components/project/create-project"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { ArrowRight, CalendarIcon } from "lucide-react"

const avatars = [
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    fallback: "OS",
    name: "Olivia Sparks",
  },
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
    fallback: "HL",
    name: "Howard Lloyd",
  },
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
    fallback: "HR",
    name: "Hallie Richards",
  },
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-16.png",
    fallback: "JW",
    name: "Jenny Wilson",
  },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState(true) // Replace with actual project type
  const navigate = useNavigate()
  
  // Mock data for display
  const startDate = new Date(2026, 0, 20)
  const endDate = new Date(2026, 2, 10)
  const completionPercentage = 50

  const chartData = [
    { activity: "completed", value: completionPercentage, fill: "var(--color-completed)" },
  ]
  const chartConfig = {
    completed: {
      label: "Completed",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  return projects === false ? (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">No Projects Yet</h2>
      <p className="text-muted-foreground">
        Get started by creating your first project.
      </p>
      <CreateNewProject />
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 w-full h-80">
      {/* Sample Project Card */}
      <Card className="flex flex-col transition-all hover:shadow-lg hover:cursor-pointer" onClick={() => navigate("/projects/1")}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1 pr-4">
            <CardTitle className="text-lg font-bold">Project Alpha</CardTitle>
            <CardDescription className="line-clamp-3 text-sm">
                This project involves a comprehensive redesign of the main dashboard to improve user engagement and mobile responsiveness. Key deliverables include new analytics widgets, a refreshed color palette, and optimized navigation flow.
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
            {avatars.map((avatar, index) => (
              <Avatar
                key={index}
                className="size-7 border-2 border-background transition-transform hover:scale-110 hover:z-10"
              >
                <AvatarImage src={avatar.src} alt={avatar.name} />
                <AvatarFallback className="text-[10px]">
                  {avatar.fallback}
                </AvatarFallback>
              </Avatar>
            ))}
            <div className="flex size-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground hover:z-10 hover:bg-muted/80">
                +2
            </div>
          </div>
        </CardFooter>
      </Card>
      {/* End Sample Card */}
    </div>
  )
}
