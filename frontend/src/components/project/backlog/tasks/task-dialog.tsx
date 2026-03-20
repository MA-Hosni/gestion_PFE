import { useState } from 'react'
import { Edit2, Check, X } from 'lucide-react'
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
import { Eye, Plus } from 'lucide-react'
import type { Task, TaskStatus, TaskPriority } from '../types'

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

// ── Add Task Dialog (trigger = "+ Add Task" button) ──────────────────────────

export function AddTaskDialog({ onAdd }: { onAdd?: (task: Omit<Task, 'id'>) => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'ToDo' as TaskStatus,
    priority: 'Medium' as TaskPriority,
    assignee: '',
  })

  const reset = () => setForm({ title: '', description: '', status: 'ToDo', priority: 'Medium', assignee: '' })

  const handleAdd = () => {
    if (!form.title.trim()) return
    onAdd?.(form)
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>Fill in the details to create a new task.</DialogDescription>
        </DialogHeader>
        <TaskFormFields form={form} onChange={setForm} disabled={false} />
        <DialogFooter className="mt-2">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleAdd}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── View / Edit Task Dialog (trigger = Eye icon in row) ──────────────────────

interface ViewTaskDialogProps {
  task: Task
  onSave?: (updated: Task) => void
}

export function ViewTaskDialog({ task, onSave }: ViewTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...task })

  const handleOpen = (o: boolean) => {
    if (!o) { setEditing(false); setForm({ ...task }) }
    setOpen(o)
  }

  const handleCancel = () => { setForm({ ...task }); setEditing(false) }
  const handleSave = () => { onSave?.(form); setEditing(false); setOpen(false) }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-base">{editing ? 'Edit Task' : 'Task Details'}</DialogTitle>
            {!editing && (
              <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => setEditing(true)}>
                <Edit2 className="h-3.5 w-3.5" /> Edit
              </Button>
            )}
          </div>
          <DialogDescription className="sr-only">View or edit task details</DialogDescription>
        </DialogHeader>
        <TaskFormFields form={form} onChange={setForm} disabled={!editing} />
        <DialogFooter className="mt-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-3.5 w-3.5 mr-1" /> Cancel
              </Button>
              <Button onClick={handleSave}>
                <Check className="h-3.5 w-3.5 mr-1" /> Save
              </Button>
            </>
          ) : (
            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Shared form fields ───────────────────────────────────────────────────────

interface FormState {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
}

interface TaskFormFieldsProps {
  form: FormState
  onChange: (f: FormState) => void
  disabled: boolean
}

function TaskFormFields({ form, onChange, disabled }: TaskFormFieldsProps) {
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => onChange({ ...form, [k]: v })

  return (
    <div className="grid gap-3 py-2">
      <FieldRow label="Title">
        <Input
          value={form.title}
          onChange={e => set('title', e.target.value)}
          disabled={disabled}
          className="h-8 text-sm"
          placeholder="Task title"
        />
      </FieldRow>
      <FieldRow label="Description">
        <Textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          disabled={disabled}
          className="text-sm min-h-[72px] resize-none"
          placeholder="Task description"
        />
      </FieldRow>
      <FieldRow label="Status">
        <Select value={form.status} onValueChange={v => set('status', v as TaskStatus)} disabled={disabled}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ToDo">To Do</SelectItem>
            <SelectItem value="InProgress">In Progress</SelectItem>
            <SelectItem value="Standby">Standby</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>
      </FieldRow>
      <FieldRow label="Priority">
        <Select value={form.priority} onValueChange={v => set('priority', v as TaskPriority)} disabled={disabled}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </FieldRow>
      <FieldRow label="Assignee">
        <Input
          value={form.assignee}
          onChange={e => set('assignee', e.target.value)}
          disabled={disabled}
          className="h-8 text-sm"
          placeholder="Assigned to"
        />
      </FieldRow>
    </div>
  )
}
