import type { CalendarMeeting } from '@/components/project/meeting-calendar/calendar/calendar-types'
import { addDays, startOfMonth } from 'date-fns'
import { colorOptions } from '@/components/project/meeting-calendar/calendar/calendar-tailwind-classes'

const MEETING_TITLES = [
  'Team Standup',
  'Project Review',
  'Client Meeting',
  'Design Workshop',
  'Code Review',
  'Sprint Planning',
  'Product Demo',
  'Architecture Discussion',
  'User Testing',
  'Stakeholder Update',
  'Tech Talk',
  'Deployment Planning',
  'Bug Triage',
  'Feature Planning',
  'Team Training',
]

// Extract color values from colorOptions
const MEETING_COLORS = colorOptions.map((color) => color.value)

function getRandomTime(date: Date): Date {
  const hours = Math.floor(Math.random() * 14) + 8 // 8 AM to 10 PM
  const minutes = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, 45
  return new Date(date.setHours(hours, minutes, 0, 0))
}

export function generateMockMeetings(): CalendarMeeting[] {
  const meetings: CalendarMeeting[] = []
  const startDate = startOfMonth(new Date())

  // Generate 120 meetings over 3 months
  for (let i = 0; i < 120; i++) {
    // Random date between start and end
    const daysToAdd = Math.floor(Math.random() * 90) // 90 days = ~3 months
    const meetingDate = addDays(startDate, daysToAdd)

    const scheduledDate = getRandomTime(meetingDate)

    meetings.push({
      id: `meeting-${i + 1}`,
      agenda:
        MEETING_TITLES[Math.floor(Math.random() * MEETING_TITLES.length)],
      color: MEETING_COLORS[Math.floor(Math.random() * MEETING_COLORS.length)],
      scheduledDate,
      referenceType: Math.random() > 0.5 ? 'task' : 'user_story',
      referenceId: `ref-${i + 1}`,
      createdBy: 'student-001',
    })
  }

  // Sort meetings by scheduled date
  return meetings.sort(
    (a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime()
  )
}