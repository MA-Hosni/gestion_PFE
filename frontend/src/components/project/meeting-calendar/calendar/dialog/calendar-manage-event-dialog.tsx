import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCalendarContext } from "../calendar-context"
import { format } from "date-fns"
import { DateTimePicker } from "@/components/project/meeting-calendar/form/date-time-picker"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
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
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  agenda: z.string().min(1, "Meeting title is required"),
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
    onUpdateMeeting,
    onDeleteMeeting,
  } = useCalendarContext()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user } = useAuth()

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
      agenda: "",
      scheduledDate: "",
    },
  })

  useEffect(() => {
    if (selectedMeeting) {
      reset({
        agenda: selectedMeeting.agenda,
        scheduledDate: format(
          selectedMeeting.scheduledDate,
          "yyyy-MM-dd'T'HH:mm"
        ),
      })
    }
    setIsEditing(false)
  }, [selectedMeeting, reset])

  async function onSubmit(values: FormValues) {
    if (!selectedMeeting) return

    try {
      setIsSubmitting(true)
      if (onUpdateMeeting) {
        await onUpdateMeeting(selectedMeeting.id, {
          agenda: values.agenda,
          scheduledDate: new Date(values.scheduledDate),
        })
      } else {
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
      }
      setIsEditing(false)
      handleClose()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update meeting")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!selectedMeeting) return
    try {
      if (onDeleteMeeting) {
        await onDeleteMeeting(selectedMeeting.id)
      } else {
        setMeetings(
          meetings.filter((meeting) => meeting.id !== selectedMeeting.id)
        )
      }
      handleClose()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete meeting")
    }
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
      scheduledDate: format(
        selectedMeeting.scheduledDate,
        "yyyy-MM-dd'T'HH:mm"
      ),
    })
    setIsEditing(false)
  }

  return (
    <Dialog open={manageMeetingDialogOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage meeting <Badge variant="outline" className="text-xs px-2 py-0.5 shadow-sm bg-blue-100/60 text-blue-700 border-transparent">Pending</Badge></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel className="font-bold">Meeting title</FieldLabel>
            <Input
              placeholder="Meeting title"
              readOnly={!isEditing}
              {...register("agenda")}
            />
            <FieldError errors={errors.agenda ? [errors.agenda] : []} />
          </Field>

          <Field>
            <FieldLabel className="font-bold">Scheduled date</FieldLabel>
            <DateTimePicker
              disabled={!isEditing}
              field={{
                value: watch("scheduledDate"),
                onChange: (value) =>
                  isEditing &&
                  setValue("scheduledDate", value, { shouldValidate: true }),
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
                value={`${selectedMeeting.referenceType} • ${selectedMeeting.referenceTitle || selectedMeeting.referenceId}`}
                readOnly
              />
            </Field>
          )}

          {selectedMeeting && (
            <Field>
              <FieldLabel className="font-bold">Created by</FieldLabel>
              <Input
                value={
                  selectedMeeting.createdByName ||
                  (selectedMeeting.createdBy === user?.id ||
                  selectedMeeting.createdBy === (user as any)?._id || selectedMeeting.createdBy === user?.profile?.id || selectedMeeting.createdBy === user?.profile?._id
                    ? user?.fullName
                    : selectedMeeting.createdBy)
                }
                readOnly
              />
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
