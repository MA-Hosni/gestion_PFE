import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useCalendarContext } from '../../calendar-context'

export default function CalendarHeaderActionsAdd() {
  const { setNewMeetingDialogOpen } = useCalendarContext()
  return (
    <Button
      className="flex items-center gap-1 bg-primary text-background"
      onClick={() => setNewMeetingDialogOpen(true)}
    >
      <Plus />
      Add Meeting
    </Button>
  )
}
