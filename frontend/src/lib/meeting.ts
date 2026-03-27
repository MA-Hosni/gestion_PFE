export type MeetingReferenceType = 'user_story' | 'task' | 'report'
export type MeetingValidationStatus = 'pending' | 'valid' | 'invalid'

const MEETING_REFERENCE_COLORS: Record<MeetingReferenceType, string> = {
  user_story: 'indigo',
  task: 'emerald',
  report: 'orange',
}

export function getMeetingColor(referenceType: MeetingReferenceType): string {
  return MEETING_REFERENCE_COLORS[referenceType] ?? 'sky'
}
