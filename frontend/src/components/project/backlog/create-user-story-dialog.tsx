import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Plus, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userStorySchema, type UserStoryFormValues } from "@/validation/user-story-validation"
import { createUserStory } from "@/services/project/api-user-story"
import { toast } from "sonner"

export function AddUserStoryDialog({ sprintId, sprintStartDate, sprintEndDate, onSuccess }: { sprintId?: string, sprintStartDate?: string, sprintEndDate?: string, onSuccess?: () => void }) {

  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<UserStoryFormValues>({
    resolver: zodResolver(userStorySchema),
    defaultValues: {
      storyName: "",
      description: "",
      startDate: "",
      dueDate: "",
      priority: "medium",
      storyPointEstimate: 0
    }
  })

  const onSubmit = async (data: UserStoryFormValues) => {
    if (!sprintId) {
      toast.error("Sprint ID is missing")
      return;
    }
    if (sprintStartDate && new Date(data.startDate) < new Date(sprintStartDate)) {
      toast.error("Start date cannot be before the sprint start date")
      return
    }
    if (sprintEndDate && new Date(data.dueDate) > new Date(sprintEndDate)) {
      toast.error("Due date cannot be after the sprint end date")
      return
    }
    setIsSubmitting(true)
    try {
      await createUserStory({
        storyName: data.storyName,
        description: data.description,
        startDate: data.startDate,
        dueDate: data.dueDate,
        priority: data.priority,
        storyPointEstimate: data.storyPointEstimate,
        sprintId
      })
      toast.success("User story created successfully")
      setOpen(false)
      reset()
      onSuccess?.()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to create user story")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Create User Story
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create User Story</DialogTitle>
            <DialogDescription>
              Add a new user story.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="mt-4 mb-6">
            <Field data-invalid={!!errors.storyName}>
              <Label htmlFor="user-story-name">User Story Name</Label>
              <Input id="user-story-name" {...register("storyName")} placeholder="e.g. As a user, I want..." />
              {errors.storyName && <FieldError>{errors.storyName.message}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.description}>
              <Label htmlFor="user-story-description">User Story Description</Label>
              <Textarea id="user-story-description" {...register("description")} />
              {errors.description && <FieldError>{errors.description.message}</FieldError>}
            </Field>

            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <Field className="w-full" data-invalid={!!errors.startDate}>
                  <FieldLabel htmlFor="start-date-picker">Start Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="start-date-picker"
                        className="justify-start font-normal"
                      >
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(d) => field.onChange(d?.toISOString() || "")}
                        disabled={[
                          ...(sprintStartDate ? [{ before: new Date(sprintStartDate) }] : []),
                          ...(sprintEndDate ? [{ after: new Date(sprintEndDate) }] : []),
                        ]}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && <FieldError>{errors.startDate.message}</FieldError>}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => (
                <Field className="w-full" data-invalid={!!errors.dueDate}>
                  <FieldLabel htmlFor="end-date-picker">Due Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="end-date-picker"
                        className="justify-start font-normal"
                      >
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(d) => field.onChange(d?.toISOString() || "")}
                        disabled={[
                          ...(sprintStartDate ? [{ before: new Date(sprintStartDate) }] : []),
                          ...(sprintEndDate ? [{ after: new Date(sprintEndDate) }] : []),
                        ]}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.dueDate && <FieldError>{errors.dueDate.message}</FieldError>}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Field data-invalid={!!errors.priority}>
                    <Label htmlFor="user-story-priority">Priority</Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="user-story-priority">
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
                    {errors.priority && <FieldError>{errors.priority.message}</FieldError>}
                  </Field>
                )}
              />

              <Field data-invalid={!!errors.storyPointEstimate}>
                <Label htmlFor="user-story-points">Points Estimation</Label>
                <Input type="number" min={0} id="user-story-points" {...register("storyPointEstimate", { valueAsNumber: true })} />
                {errors.storyPointEstimate && <FieldError>{errors.storyPointEstimate.message}</FieldError>}
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
               {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
               Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
