import { CalendarContext } from './calendar-context'
import type { CalendarMeeting, Mode } from './calendar-types'
import { useState } from 'react'
import CalendarManageEventDialog from './dialog/calendar-manage-event-dialog'

export default function CalendarProvider({
  meetings,
  setMeetings,
  mode,
  setMode,
  date,
  setDate,
  calendarIconIsToday = true,
  children,
}: {
  meetings: CalendarMeeting[]
  setMeetings: (meetings: CalendarMeeting[]) => void
  mode: Mode
  setMode: (mode: Mode) => void
  date: Date
  setDate: (date: Date) => void
  calendarIconIsToday: boolean
  children: React.ReactNode
}) {
  const [newMeetingDialogOpen, setNewMeetingDialogOpen] = useState(false)
  const [manageMeetingDialogOpen, setManageMeetingDialogOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<CalendarMeeting | null>(
    null
  )

  return (
    <CalendarContext.Provider
      value={{
        meetings,
        setMeetings,
        mode,
        setMode,
        date,
        setDate,
        calendarIconIsToday,
        newMeetingDialogOpen,
        setNewMeetingDialogOpen,
        manageMeetingDialogOpen,
        setManageMeetingDialogOpen,
        selectedMeeting,
        setSelectedMeeting,
      }}
    >
      <CalendarManageEventDialog />
      {children}
    </CalendarContext.Provider>
  )
}
