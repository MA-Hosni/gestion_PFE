import { useState } from 'react'
import Calendar from '@/components/project/meeting-calendar/calendar/calendar'
import type {
  CalendarMeeting,
  Mode,
} from '@/components/project/meeting-calendar/calendar/calendar-types'

interface CalendarPageProps {
  meetings: CalendarMeeting[]
  setMeetings: (meetings: CalendarMeeting[]) => void
}

export default function CalendarPage({ meetings, setMeetings }: CalendarPageProps) {
  const [mode, setMode] = useState<Mode>('month')
  const [date, setDate] = useState<Date>(new Date())

  return (
    <Calendar
      meetings={meetings}
      setMeetings={setMeetings}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
    />
  )
}
