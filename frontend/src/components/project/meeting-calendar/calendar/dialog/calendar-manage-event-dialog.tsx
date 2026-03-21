import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCalendarContext } from '../calendar-context'
import { format } from 'date-fns'
import { DateTimePicker } from '@/components/project/meeting-calendar/form/date-time-picker'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const formSchema = z
  .object({
    agenda: z.string().min(1, 'Meeting title is required'),
    scheduledDate: z.string().datetime(),
  })

type FormValues = z.infer<typeof formSchema>

export default function CalendarManageEventDialog() {
  const {
    manageMeetingDialogOpen,
    setManageMeetingDialogOpen,
    selectedMeeting,
    setSelectedMeeting,
    meetings,
    setMeetings,
  } = useCalendarContext()
  const [isEditing, setIsEditing] = useState(false)

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
      agenda: '',
      scheduledDate: '',
    },
  })

  useEffect(() => {
    if (selectedMeeting) {
      reset({
        agenda: selectedMeeting.agenda,
        scheduledDate: format(selectedMeeting.scheduledDate, "yyyy-MM-dd'T'HH:mm"),
      })
    }
    setIsEditing(false)
  }, [selectedMeeting, reset])

  function onSubmit(values: FormValues) {
    if (!selectedMeeting) return

    const updatedMeeting = {
      ...selectedMeeting,
      agenda: values.agenda,
      scheduledDate: new Date(values.scheduledDate),
    }

    setMeetings(
      meetings.map((meeting) =>
        meeting.id === selectedMeeting.id ? updatedMeeting : meeting
      )
    )
    setIsEditing(false)
    handleClose()
  }

  function handleDelete() {
    if (!selectedMeeting) return
    setMeetings(meetings.filter((meeting) => meeting.id !== selectedMeeting.id))
    handleClose()
  }

  function handleClose() {
    setManageMeetingDialogOpen(false)
    setSelectedMeeting(null)
    setIsEditing(false)
    reset()
  }

  function handleCancelEdit() {
    if (!selectedMeeting) {
      setIsEditing(false)
      return
    }

    reset({
      agenda: selectedMeeting.agenda,
      scheduledDate: format(selectedMeeting.scheduledDate, "yyyy-MM-dd'T'HH:mm"),
    })
    setIsEditing(false)
  }

  return (
    <Dialog open={manageMeetingDialogOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage meeting</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel className="font-bold">Meeting title</FieldLabel>
            <Input
              placeholder="Meeting title"
              readOnly={!isEditing}
              {...register('agenda')}
            />
            <FieldError errors={errors.agenda ? [errors.agenda] : []} />
          </Field>

          <Field>
            <FieldLabel className="font-bold">Scheduled date</FieldLabel>
            <DateTimePicker
              field={{
                value: watch('scheduledDate'),
                onChange: (value) =>
                  isEditing &&
                  setValue('scheduledDate', value, { shouldValidate: true }),
              }}
            />
            <FieldError
              errors={errors.scheduledDate ? [errors.scheduledDate] : []}
            />
          </Field>

          {selectedMeeting && (
            <Field>
              <FieldLabel className="font-bold">Reference</FieldLabel>
              <Input
                value={`${selectedMeeting.referenceType} • ${selectedMeeting.referenceId}`}
                readOnly
              />
            </Field>
          )}

          {selectedMeeting && (
            <Field>
              <FieldLabel className="font-bold">Created by</FieldLabel>
              <Input value={selectedMeeting.createdBy} readOnly />
            </Field>
          )}

          <DialogFooter className="flex justify-between gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete meeting</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this meeting? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {!isEditing ? (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Update meeting
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
