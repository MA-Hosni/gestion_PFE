import { useState } from 'react'
import Calendar from '@/components/project/meeting-calendar/calendar/calendar'
import type {
  CalendarMeeting,
  Mode,
} from '@/components/project/meeting-calendar/calendar/calendar-types'

import type { UpdateMeetingInput } from '@/hooks/use-meetings'

interface CalendarPageProps {
  meetings: CalendarMeeting[]
  setMeetings: (meetings: CalendarMeeting[]) => void
  onUpdateMeeting?: (meetingId: string, input: UpdateMeetingInput) => Promise<CalendarMeeting | null> | CalendarMeeting | null
  onDeleteMeeting?: (meetingId: string) => Promise<void> | void
}

export default function CalendarPage({
  meetings,
  setMeetings,
  onUpdateMeeting,
  onDeleteMeeting,
}: CalendarPageProps) {
  const [mode, setMode] = useState<Mode>('month')
  const [date, setDate] = useState<Date>(new Date())

  return (
    <Calendar
      meetings={meetings}
      setMeetings={setMeetings}
      onUpdateMeeting={onUpdateMeeting}
      onDeleteMeeting={onDeleteMeeting}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
    />
  )
}
