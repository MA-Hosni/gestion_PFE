import type { CalendarMeeting } from '@/components/project/meeting-calendar/calendar/calendar-types'
import { useCalendarContext } from '@/components/project/meeting-calendar/calendar/calendar-context'
import { format, isSameDay, isSameMonth } from 'date-fns'
import { cn } from '@/lib/utils'
import { motion, MotionConfig, AnimatePresence } from 'framer-motion'

interface EventPosition {
  left: string
  width: string
  top: string
  height: string
}

const MEETING_BLOCK_MINUTES = 60

function calculateEventPosition(
  meeting: CalendarMeeting,
  allMeetings: CalendarMeeting[]
): EventPosition {
  const sameTimeMeetings = allMeetings
    .filter(
      (item) =>
        isSameDay(item.scheduledDate, meeting.scheduledDate) &&
        item.scheduledDate.getHours() === meeting.scheduledDate.getHours() &&
        item.scheduledDate.getMinutes() === meeting.scheduledDate.getMinutes()
    )
    .sort((a, b) => a.id.localeCompare(b.id))

  const position = sameTimeMeetings.findIndex((item) => item.id === meeting.id)
  const width = `${100 / Math.max(sameTimeMeetings.length, 1)}%`
  const left = `${(position * 100) / Math.max(sameTimeMeetings.length, 1)}%`

  const startHour = meeting.scheduledDate.getHours()
  const startMinutes = meeting.scheduledDate.getMinutes()

  const topPosition = startHour * 128 + (startMinutes / 60) * 128
  const height = (MEETING_BLOCK_MINUTES / 60) * 128

  return {
    left,
    width,
    top: `${topPosition}px`,
    height: `${height}px`,
  }
}

export default function CalendarEvent({
  meeting,
  month = false,
  className,
}: {
  meeting: CalendarMeeting
  month?: boolean
  className?: string
}) {
  const { meetings, setSelectedMeeting, setManageMeetingDialogOpen, date } =
    useCalendarContext()
  const style = month ? {} : calculateEventPosition(meeting, meetings)

  // Generate a unique key that includes the current month to prevent animation conflicts
  const isMeetingInCurrentMonth = isSameMonth(meeting.scheduledDate, date)
  const animationKey = `${meeting.id}-${isMeetingInCurrentMonth ? 'current' : 'adjacent'
    }`

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <motion.div
          className={cn(
            `px-3 py-1.5 rounded-md truncate cursor-pointer transition-all duration-300 bg-${event.color}-500/10 hover:bg-${event.color}-500/20 border border-${event.color}-500`,
            `px-3 py-1.5 rounded-md truncate cursor-pointer transition-all duration-300 bg-${meeting.color}-500/10 hover:bg-${meeting.color}-500/20 border border-${meeting.color}-500`,
            !month && 'absolute',
            className
          )}
          style={style}
          onClick={(e) => {
            e.stopPropagation()
            setSelectedMeeting(meeting)
            setManageMeetingDialogOpen(true)
          }}
          initial={{
            opacity: 0,
            y: -3,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.98,
            transition: {
              duration: 0.15,
              ease: 'easeOut',
            },
          }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
            opacity: {
              duration: 0.2,
              ease: 'linear',
            },
            layout: {
              duration: 0.2,
              ease: 'easeOut',
            },
          }}
          layoutId={`event-${animationKey}-${month ? 'month' : 'day'}`}
        >
          <motion.div
            className={cn(
              `flex flex-col w-full text-${event.color}-500`,
              `flex flex-col w-full text-${meeting.color}-500`,
              month && 'flex-row items-center justify-between'
            )}
            layout="position"
          >
            <p className={cn('font-bold truncate', month && 'text-xs')}>
              {meeting.agenda}
            </p>
            <p className={cn('text-sm', month && 'text-xs')}>
              <span>{format(meeting.scheduledDate, 'h:mm a')}</span>
              <span className={cn('mx-1', month && 'hidden')}>-</span>
              <span className={cn(month && 'hidden')}>+1h</span>
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  )
}
