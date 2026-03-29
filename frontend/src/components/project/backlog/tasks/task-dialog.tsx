import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye, Plus, Loader2, Edit2 } from 'lucide-react'
import { Field, FieldError } from '@/components/ui/field'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, type TaskFormValues } from '@/validation/task-validation'
import { createTask, updateTask } from '@/services/project/api-task'
import { toast } from 'sonner'
import type { Task } from '../types'
import type { Contributor } from '@/services/project/api-project'

// ── Shared field layout ──────────────────────────────────────────────────────

interface FieldRowProps {
  label: string
  children: React.ReactNode
}

function FieldRow({ label, children }: FieldRowProps) {
  return (
    <div className="grid grid-cols-3 items-center gap-3">
      <Label className="text-right text-xs text-muted-foreground">{label}</Label>
      <div className="col-span-2">{children}</div>
    </div>
  )
}

// ── Helper: resolve contributor name from id ─────────────────────────────────
function getContributorName(id: string | undefined, contributors: Contributor[]) {
  if (!id) return "Unassigned"
  const c = contributors.find(c => c._id === id)
  return c?.fullName ?? id
}

// ── Add Task Dialog (trigger = "+ Add Task" button) ──────────────────────────

interface AddTaskDialogProps {
  userStoryId: string
  contributors: Contributor[]
  onSuccess?: () => void
}

export function AddTaskDialog({ userStoryId, contributors, onSuccess }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'ToDo',
      priority: 'Medium',
      assignedTo: '',
    }
  })

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true)
    try {
      await createTask({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
        userStoryId,
      })
      toast.success("Task created successfully")
      setOpen(false)
      reset()
      onSuccess?.()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to create task")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset() }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>Fill in the details to create a new task.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <FieldRow label="Title">
              <Field data-invalid={!!errors.title}>
                <Input
                  {...register("title")}
                  className="h-8 text-sm"
                  placeholder="Task title"
                />
                {errors.title && <FieldError>{errors.title.message}</FieldError>}
              </Field>
            </FieldRow>
            <FieldRow label="Description">
              <Textarea
                {...register("description")}
                className="text-sm min-h-18 resize-none"
                placeholder="Task description"
              />
            </FieldRow>
            <FieldRow label="Assignee">
              <Field data-invalid={!!errors.assignedTo}>
                <Controller
                  control={control}
                  name="assignedTo"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select assignee" /></SelectTrigger>
                      <SelectContent>
                        {contributors.map(c => (
                          <SelectItem key={c._id} value={c._id}>{c.fullName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.assignedTo && <FieldError>{errors.assignedTo.message}</FieldError>}
              </Field>
            </FieldRow>
            <FieldRow label="Status">
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ToDo">To Do</SelectItem>
                      <SelectItem value="InProgress">In Progress</SelectItem>
                      <SelectItem value="Standby">Standby</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldRow>
            <FieldRow label="Priority">
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldRow>
          </div>
          <DialogFooter className="mt-2">
            <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button></DialogClose>
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

// ── View / Edit Task Dialog (trigger = Eye icon in row) ──────────────────────

interface ViewEditTaskDialogProps {
  task: Task
  contributors: Contributor[]
  onRefresh: () => void
}

export function ViewEditTaskDialog({ task, contributors, onRefresh }: ViewEditTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
      status: task.status as TaskFormValues['status'],
      priority: task.priority as TaskFormValues['priority'],
      assignedTo: task.assignedTo ?? '',
    }
  })

  // Sync form when task data changes (e.g. after external refresh)
  useEffect(() => {
    reset({
      title: task.title,
      description: task.description ?? '',
      status: task.status as TaskFormValues['status'],
      priority: task.priority as TaskFormValues['priority'],
      assignedTo: task.assignedTo ?? '',
    })
  }, [task, reset])

  const handleCancel = () => {
    setIsEditing(false)
    reset({
      title: task.title,
      description: task.description ?? '',
      status: task.status as TaskFormValues['status'],
      priority: task.priority as TaskFormValues['priority'],
      assignedTo: task.assignedTo ?? '',
    })
  }

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true)
    try {
      await updateTask(task.id, {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
      })
      toast.success("Task updated successfully")
      setIsEditing(false)
      onRefresh()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to update task")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setIsEditing(false); handleCancel() } }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-base flex items-center justify-between pr-6">
              Task Details
              {!isEditing && (
                <Button type="button" variant="ghost" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </Button>
              )}
            </DialogTitle>
            <DialogDescription className="sr-only">View and edit task details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            {/* Title */}
            <FieldRow label="Title">
              {isEditing ? (
                <Field data-invalid={!!errors.title}>
                  <Input {...register("title")} className="h-8 text-sm" />
                  {errors.title && <FieldError>{errors.title.message}</FieldError>}
                </Field>
              ) : (
                <Input value={task.title} disabled className="h-8 text-sm" />
              )}
            </FieldRow>
            {/* Description */}
            <FieldRow label="Description">
              {isEditing ? (
                <Textarea {...register("description")} className="text-sm min-h-18 resize-none" />
              ) : (
                <Textarea value={task.description || "No description"} disabled className="text-sm min-h-18 resize-none" />
              )}
            </FieldRow>
            {/* Assignee */}
            <FieldRow label="Assignee">
              {isEditing ? (
                <Field data-invalid={!!errors.assignedTo}>
                  <Controller
                    control={control}
                    name="assignedTo"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select assignee" /></SelectTrigger>
                        <SelectContent>
                          {contributors.map(c => (
                            <SelectItem key={c._id} value={c._id}>{c.fullName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.assignedTo && <FieldError>{errors.assignedTo.message}</FieldError>}
                </Field>
              ) : (
                <Input value={getContributorName(task.assignedTo, contributors)} disabled className="h-8 text-sm" />
              )}
            </FieldRow>
            {/* Status */}
            <FieldRow label="Status">
              {isEditing ? (
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ToDo">To Do</SelectItem>
                        <SelectItem value="InProgress">In Progress</SelectItem>
                        <SelectItem value="Standby">Standby</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <Input value={task.status} disabled />
              )}
            </FieldRow>
            {/* Priority */}
            <FieldRow label="Priority">
              {isEditing ? (
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <Input value={task.priority} disabled />
              )}
            </FieldRow>
          </div>
          <DialogFooter className="mt-2">
            {isEditing ? (
              <>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save
                </Button>
              </>
            ) : (
              <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
