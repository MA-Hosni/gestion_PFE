import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from 'react'
import CalendarPage from './CalendarPage'
import BoardPage from './BoardPage'
import ContributorsPage from './ContributorsPage'
import BacklogPage from './BacklogPage'

// Placeholder components - replaced with actual components later
const Summary = () => <div className="p-4 border rounded-lg bg-muted/20 h-96 flex items-center justify-center">Summary Component</div>

function ProjectDetailsPage() {
  const [title, setTitle] = useState("Project Title")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  
  const [description, setDescription] = useState(
    "This is a dee all the informatThis is a detailed view of the project. Here you can see all the informationion This is a detailed view of the project. Here you can see all the information related to the project, including tasks, team members, timelines, and more."
  )
  const [isEditingDescription, setIsEditingDescription] = useState(false)

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 w-full">
        {isEditingTitle ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
            autoFocus
            className="text-2xl font-bold h-auto py-2 px-1 w-auto"
          />
        ) : (
          <h1 
            onClick={() => setIsEditingTitle(true)}
            className="text-2xl font-bold hover:bg-muted/50 p-1 -ml-1 rounded cursor-pointer transition-colors"
          >
            {title}
          </h1>
        )}

        {isEditingDescription ? (
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => setIsEditingDescription(false)}
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
      </div>

      <Tabs defaultValue="Summary" className="w-full">
        <TabsList variant="line" className="w-full border-b h-auto">
          <TabsTrigger value="Summary">Summary</TabsTrigger>
          <TabsTrigger value="Backlog">Backlog</TabsTrigger>
          <TabsTrigger value="Contributors">Contributors</TabsTrigger>
          <TabsTrigger value="Board">Board</TabsTrigger>
          <TabsTrigger value="Calendar">Calendar</TabsTrigger>
        </TabsList>
        <div className="h-[calc(100vh-16rem)]">
          <TabsContent value="Summary"><Summary /></TabsContent>
          <TabsContent value="Backlog"><BacklogPage /></TabsContent>
          <TabsContent value="Contributors"><ContributorsPage /></TabsContent>
          <TabsContent value="Board"><BoardPage /></TabsContent>
          <TabsContent value="Calendar"><CalendarPage /></TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default ProjectDetailsPage