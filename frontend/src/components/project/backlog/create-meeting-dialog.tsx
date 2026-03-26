import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Presentation } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { DateTimePicker } from '@/components/project/meeting-calendar/form/date-time-picker'
import type { CalendarMeeting } from '@/components/project/meeting-calendar/calendar/calendar-types'

const formSchema = z.object({
  agenda: z.string().min(1, 'Meeting title is required'),
  scheduledDate: z.string().datetime(),
})

type FormValues = z.infer<typeof formSchema>

interface CreateMeetingDialogProps {
  referenceType: 'user_story' | 'task'
  referenceId: string
  defaultAgenda: string
  createdBy: string
  varient?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onCreateMeeting: (
    meeting: Omit<CalendarMeeting, 'id' | 'color'> & { color?: string }
  ) => void
}

function getMeetingColor(referenceType: 'user_story' | 'task') {
  return referenceType === 'user_story' ? 'indigo' : 'emerald'
}

export function CreateMeetingDialog({
  referenceType,
  referenceId,
  defaultAgenda,
  createdBy,
  varient = "outline",
  onCreateMeeting,
}: CreateMeetingDialogProps) {
  const [open, setOpen] = useState(false)
  const todayIso = useMemo(() => format(new Date(), "yyyy-MM-dd'T'HH:mm"), [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agenda: defaultAgenda,
      scheduledDate: todayIso,
    },
  })

  function handleOpenChange(open: boolean) {
    setOpen(open)
    if (open) {
      reset({
        agenda: defaultAgenda,
        scheduledDate: todayIso,
      })
    }
  }

  function onSubmit(values: FormValues) {
    onCreateMeeting({
      agenda: values.agenda,
      scheduledDate: new Date(values.scheduledDate),
      referenceType,
      referenceId,
      createdBy,
      color: getMeetingColor(referenceType),
    })
    reset({
      agenda: defaultAgenda,
      scheduledDate: todayIso,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={varient}
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-muted/50"
          title="Create meeting"
          onClick={(e) => e.stopPropagation()}
        >
          <Presentation className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Create meeting</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Field>
            <FieldLabel className="font-bold">Meeting title</FieldLabel>
            <Input placeholder="Enter meeting title" {...register('agenda')} />
            <FieldError errors={errors.agenda ? [errors.agenda] : []} />
          </Field>

          <Field>
            <FieldLabel className="font-bold">Scheduled date</FieldLabel>
            <DateTimePicker
              field={{
                value: watch('scheduledDate'),
                onChange: (value) =>
                  setValue('scheduledDate', value, { shouldValidate: true }),
              }}
            />
            <FieldError
              errors={errors.scheduledDate ? [errors.scheduledDate] : []}
            />
          </Field>

          <div className="flex justify-end">
            <Button type="submit">Create meeting</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
