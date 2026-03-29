import { useCalendarContext } from '../../calendar-context'
import { isSameDay } from 'date-fns'

export default function CalendarBodyDayEvents() {
  const { meetings, date, setManageMeetingDialogOpen, setSelectedMeeting } =
    useCalendarContext()
  const dayMeetings = meetings.filter((meeting) =>
    isSameDay(meeting.scheduledDate, date)
  )

  return !!dayMeetings.length ? (
    <div className="flex flex-col gap-2">
      <p className="font-medium p-2 pb-0 font-heading">Meetings</p>
      <div className="flex flex-col gap-2">
        {dayMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="flex items-center gap-2 px-2 cursor-pointer"
            onClick={() => {
              setSelectedMeeting(meeting)
              setManageMeetingDialogOpen(true)
            }}
          >
            <div className="flex items-center gap-2">
              <div className={`size-2 rounded-full bg-${meeting.color}-500`} />
              <p className="text-muted-foreground text-sm font-medium">
                {meeting.agenda}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="p-2 text-muted-foreground">No meetings today...</div>
  )
}
