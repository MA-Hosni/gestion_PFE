import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { addDays, format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { type DateRange } from "react-day-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { getStudentsWithoutProject, createProject } from "@/services/project/api-project"
import { toast } from "sonner"

export function CreateNewProject() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  })
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [availableUsers, setAvailableUsers] = useState<{ _id: string, fullName: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch available students when sheet opens
  useEffect(() => {
    if (open) {
      async function loadUsers() {
        try {
          const users = await getStudentsWithoutProject()
          setAvailableUsers(users)
        } catch (error) {
          console.error("Failed to load users", error)
        }
      }
      loadUsers()
    }
  }, [open])

  const handleSubmit = async () => {
    // 1. Title Validation
    if (!title || !title.trim()) {
      toast?.error?.("Title is required")
      return
    }
    if (title.trim().length < 3) {
      toast?.error?.("Title must be at least 3 characters long")
      return
    }
    if (title.length > 200) {
      toast?.error?.("Title cannot exceed 200 characters")
      return
    }

    // 2. Description Validation
    if (description && description.length > 2000) {
      toast?.error?.("Description cannot exceed 2000 characters")
      return
    }

    // 3. Date Validation
    if (!date?.from) {
      toast?.error?.("Start date is required")
      return
    }
    if (!date?.to) {
      toast?.error?.("End date is required")
      return
    }
    if (date.to <= date.from) {
      toast?.error?.("End date must be after start date")
      return
    }

    setIsSubmitting(true)
    try {
      await createProject({
        title: title.trim(),
        description: description.trim(),
        startDate: date.from.toISOString(),
        endDate: date.to.toISOString(),
        contributors: selectedUsers
      })
      toast?.success?.("Project created successfully")
      setOpen(false)
      // Reload or trigger parent refresh to display the newly created project
      window.location.reload()
    } catch (error: any) {
      console.error(error)
      const message = error.response?.data?.message || "Failed to create project"
      toast?.error?.(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Create New Project</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create Project</SheetTitle>
          <SheetDescription>Set up the core details for your new project.</SheetDescription>
        </SheetHeader>
        
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="project-title">Project Title</Label>
            <Input 
              id="project-title" 
              name="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NextGen Analytics Dashboard"
              required 
            />
          </div>
          
          <div className="grid gap-3">
            <FieldLabel htmlFor="project-description">Description</FieldLabel>
            <Textarea 
              id="project-description" 
              className="resize-none min-h-30" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief overview of the project goals..."
            />
          </div>
          
          <div className="grid gap-3">
            <FieldLabel htmlFor="date-picker-range">
                Project Date Range
            </FieldLabel>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="date-picker-range"
                    className="justify-start px-2.5 font-normal"
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                    date.to ? (
                        <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(date.from, "LLL dd, y")
                    )
                    ) : (
                    <span>Pick a date range</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-3">
            <Field>
                <FieldLabel>Contributors</FieldLabel>
                <MultiSelect
                   values={selectedUsers} 
                   onValuesChange={setSelectedUsers}
                >
                <MultiSelectTrigger className="w-full">
                    <MultiSelectValue overflowBehavior="wrap" placeholder={availableUsers.length === 0 ? "No available students" : "Select contributors..."} />
                </MultiSelectTrigger>
                <MultiSelectContent>
                    <MultiSelectGroup>
                    {availableUsers.map((user) => (
                      <MultiSelectItem key={user._id} value={user._id}>
                          {user.fullName}
                      </MultiSelectItem>
                    ))}
                    </MultiSelectGroup>
                </MultiSelectContent>
                </MultiSelect>
            </Field>
          </div>
        </div>
        
        <SheetFooter className="mt-auto">
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting || !title.trim()}>
             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
             Create Project
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
             Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
