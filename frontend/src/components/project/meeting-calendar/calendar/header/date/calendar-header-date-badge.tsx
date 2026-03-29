import { useCalendarContext } from '../../calendar-context'
import { isSameMonth } from 'date-fns'

export default function CalendarHeaderDateBadge() {
  const { meetings, date } = useCalendarContext()
  const monthMeetings = meetings.filter((meeting) =>
    isSameMonth(meeting.scheduledDate, date)
  )

  if (!monthMeetings.length) return null
  return (
    <div className="whitespace-nowrap rounded-sm border px-1.5 py-0.5 text-xs">
      {monthMeetings.length} meetings
    </div>
  )
}
