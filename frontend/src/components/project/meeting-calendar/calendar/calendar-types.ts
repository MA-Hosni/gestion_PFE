export type CalendarProps = {
  meetings: CalendarMeeting[]
  setMeetings: (meetings: CalendarMeeting[]) => void
  mode: Mode
  setMode: (mode: Mode) => void
  date: Date
  setDate: (date: Date) => void
  calendarIconIsToday?: boolean
}

export type CalendarContextType = CalendarProps & {
  newMeetingDialogOpen: boolean
  setNewMeetingDialogOpen: (open: boolean) => void
  manageMeetingDialogOpen: boolean
  setManageMeetingDialogOpen: (open: boolean) => void
  selectedMeeting: CalendarMeeting | null
  setSelectedMeeting: (meeting: CalendarMeeting | null) => void
}
export type CalendarMeeting = {
  id: string
  agenda: string
  color: string
  scheduledDate: Date
  referenceType: 'user_story' | 'task'
  referenceId: string
  createdBy: string
}

export const calendarModes = ['day', 'week', 'month'] as const
export type Mode = (typeof calendarModes)[number]