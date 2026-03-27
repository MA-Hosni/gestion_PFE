import type { MeetingReferenceType, MeetingValidationStatus } from '@/lib/meeting'
import type { UpdateMeetingInput } from '@/hooks/use-meetings'

export type CalendarProps = {
  meetings: CalendarMeeting[]
  setMeetings: (meetings: CalendarMeeting[]) => void
  mode: Mode
  setMode: (mode: Mode) => void
  date: Date
  setDate: (date: Date) => void
  calendarIconIsToday?: boolean
  onUpdateMeeting?: (meetingId: string, input: UpdateMeetingInput) => Promise<CalendarMeeting | null> | CalendarMeeting | null
  onDeleteMeeting?: (meetingId: string) => Promise<void> | void
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
  referenceType: MeetingReferenceType
  referenceId: string
  referenceTitle?: string
  createdBy: string
  createdByName?: string
  actualMinutes: string | null
  validationStatus: MeetingValidationStatus
  validatorId: string | null
  projectId: string
  createdAt: Date | null
  updatedAt: Date | null
}

export const calendarModes = ['day', 'week', 'month'] as const
export type Mode = (typeof calendarModes)[number]