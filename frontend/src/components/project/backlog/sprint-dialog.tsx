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
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sprintSchema, type SprintFormValues } from "@/validation/sprint-validation"
import { createSprint, updateSprint } from "@/services/project/api-sprint"
import { toast } from "sonner"
import { Loader2, Pencil } from "lucide-react"

interface SprintDialogProps {
  trigger?: React.ReactNode
  buttonText?: React.ReactNode
  projectId?: string
  onSuccess?: () => void
  mode?: "create" | "edit"
  sprintId?: string
  initialData?: {
    title: string
    goal?: string
    startDate: string
    endDate: string
  }
}

export function SprintDialog({
  trigger,
  buttonText,
  projectId,
  onSuccess,
  mode = "create",
  sprintId,
  initialData,
}: SprintDialogProps) {
  const isEdit = mode === "edit"
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<SprintFormValues>({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      title: "",
      goal: "",
      startDate: "",
      endDate: "",
    }
  })

  // When opening in edit mode, pre-fill with existing sprint data
  useEffect(() => {
    if (open && isEdit && initialData) {
      reset({
        title: initialData.title,
        goal: initialData.goal ?? "",
        startDate: initialData.startDate,
        endDate: initialData.endDate,
      })
    }
    if (open && !isEdit) {
      reset({ title: "", goal: "", startDate: "", endDate: "" })
    }
  }, [open, isEdit, initialData, reset])

  const onSubmit = async (data: SprintFormValues) => {
    setIsSubmitting(true)
    try {
      if (isEdit) {
        if (!sprintId) {
          toast.error("Sprint ID is missing")
          return
        }
        await updateSprint(sprintId, data)
        toast.success("Sprint updated successfully")
      } else {
        if (!projectId) {
          toast.error("Project context is missing")
          return
        }
        await createSprint({ ...data, projectId })
        toast.success("Sprint created successfully")
      }
      setOpen(false)
      reset()
      onSuccess?.()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.error || err.response?.data?.message || `Failed to ${isEdit ? "update" : "create"} sprint`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const dialogTitle = isEdit ? "Edit Sprint" : "Create Sprint"
  const dialogDescription = isEdit ? "Update the sprint details." : "Create a new sprint for the project."

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          isEdit ? (
            <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Pencil className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline">{buttonText ?? "Create Sprint"}</Button>
          )
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <FieldGroup className="mt-4 mb-6">
            <Field data-invalid={!!errors.title}>
              <Label htmlFor="sprint-title">Sprint Name</Label>
              <Input id="sprint-title" {...register("title")} placeholder="e.g. Sprint 1" />
              {errors.title && <FieldError>{errors.title.message}</FieldError>}
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
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(d) => field.onChange(d?.toISOString() || "")}
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
              name="endDate"
              render={({ field }) => (
                <Field className="w-full" data-invalid={!!errors.endDate}>
                  <FieldLabel htmlFor="end-date-picker">End Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="end-date-picker"
                        className="justify-start font-normal"
                      >
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick an end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(d) => field.onChange(d?.toISOString() || "")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.endDate && <FieldError>{errors.endDate.message}</FieldError>}
                </Field>
              )}
            />

            <Field data-invalid={!!errors.goal}>
              <Label htmlFor="sprint-goal">Sprint Goal</Label>
              <Textarea id="sprint-goal" {...register("goal")} placeholder="Describe the sprint goal..." />
              {errors.goal && <FieldError>{errors.goal.message}</FieldError>}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
               {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
               {isEdit ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
