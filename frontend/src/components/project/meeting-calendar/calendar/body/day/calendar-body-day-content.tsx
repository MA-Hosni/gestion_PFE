import { useCalendarContext } from '../../calendar-context'
import { isSameDay } from 'date-fns'
import { hours } from './calendar-body-margin-day-margin'
import CalendarBodyHeader from '../calendar-body-header'
import CalendarEvent from '../../calendar-event'

export default function CalendarBodyDayContent({ date }: { date: Date }) {
  const { meetings } = useCalendarContext()

  const dayMeetings = meetings.filter((meeting) =>
    isSameDay(meeting.scheduledDate, date)
  )

  return (
    <div className="flex flex-col grow">
      <CalendarBodyHeader date={date} />

      <div className="flex-1 relative">
        {hours.map((hour) => (
          <div key={hour} className="h-32 border-b border-border/50 group" />
        ))}

        {dayMeetings.map((meeting) => (
          <CalendarEvent key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </div>
  )
}
