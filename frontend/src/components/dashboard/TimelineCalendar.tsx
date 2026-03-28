import { useState, useCallback, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { TimelineEvent, TimelineEventType } from "@/services/project/api-dashboard"

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimelineCalendarProps {
  onFetchTimeline: (month: number, year: number) => Promise<TimelineEvent[]>
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const EVENT_COLORS: Record<TimelineEventType, string> = {
  meeting: "bg-blue-500",
  report: "bg-violet-500",
  status_change: "bg-emerald-500",
  validation: "bg-amber-500",
}

const EVENT_LABELS: Record<TimelineEventType, string> = {
  meeting: "Meeting",
  report: "Report",
  status_change: "Status Change",
  validation: "Validation",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay()
}

function groupEventsByDay(events: TimelineEvent[]): Map<number, TimelineEvent[]> {
  const map = new Map<number, TimelineEvent[]>()
  events.forEach((event) => {
    const day = new Date(event.date).getDate()
    const existing = map.get(day) ?? []
    map.set(day, [...existing, event])
  })
  return map
}

// ─── Event Dot ────────────────────────────────────────────────────────────────

function EventDot({ type }: { type: TimelineEventType }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${EVENT_COLORS[type]}`}
      title={EVENT_LABELS[type]}
    />
  )
}

// ─── Day Cell ─────────────────────────────────────────────────────────────────

function DayCell({
  day,
  isToday,
  events,
}: {
  day: number
  isToday: boolean
  events: TimelineEvent[]
}) {
  const uniqueTypes = [...new Set(events.map((e) => e.type))]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`
            relative flex h-10 w-full flex-col items-center justify-center rounded-md text-sm
            transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
            ${events.length > 0 ? "cursor-pointer hover:bg-muted/60" : "cursor-default"}
            ${isToday ? "bg-primary/10 font-bold text-primary ring-1 ring-primary/30" : "text-foreground"}
          `}
          disabled={events.length === 0}
        >
          <span className="leading-none">{day}</span>
          {uniqueTypes.length > 0 && (
            <div className="mt-0.5 flex gap-0.5">
              {uniqueTypes.slice(0, 3).map((type) => (
                <EventDot key={type} type={type} />
              ))}
            </div>
          )}
        </button>
      </PopoverTrigger>
      {events.length > 0 && (
        <PopoverContent
          className="w-72 p-3"
          align="center"
          side="top"
          sideOffset={4}
        >
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {events.length} event{events.length > 1 ? "s" : ""} on day {day}
          </p>
          <ul className="space-y-2">
            {events.map((event, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${EVENT_COLORS[event.type]}`}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium leading-tight">
                    {event.title}
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground leading-snug">
                    {event.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </PopoverContent>
      )}
    </Popover>
  )
}

// ─── Legend ──────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      {(Object.keys(EVENT_LABELS) as TimelineEventType[]).map((type) => (
        <span key={type} className="flex items-center gap-1.5">
          <span className={`inline-block h-2 w-2 rounded-full ${EVENT_COLORS[type]}`} />
          {EVENT_LABELS[type]}
        </span>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TimelineCalendar({ onFetchTimeline }: TimelineCalendarProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchEvents = useCallback(
    async (month: number, year: number) => {
      setIsLoading(true)
      try {
        const data = await onFetchTimeline(month, year)
        setEvents(data)
      } catch {
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    },
    [onFetchTimeline]
  )

  useEffect(() => {
    fetchEvents(currentMonth, currentYear)
  }, [currentMonth, currentYear, fetchEvents])

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const eventMap = groupEventsByDay(events)

  // Build calendar grid cells (empty + day numbers)
  const cells: (number | null)[] = [
    ...Array.from<null>({ length: firstDay }).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold">Timeline</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={prevMonth}
              disabled={isLoading}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[130px] text-center text-sm font-medium tabular-nums">
              {MONTH_NAMES[currentMonth - 1]} {currentYear}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={nextMonth}
              disabled={isLoading}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="mt-1">
          <Legend />
        </CardDescription>
      </CardHeader>

      <CardContent className="relative px-4 pb-4">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-b-xl bg-background/60 backdrop-blur-sm">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}

        {/* Day-of-week headers */}
        <div className="mb-1 grid grid-cols-7 text-center">
          {DAY_LABELS.map((d) => (
            <div
              key={d}
              className="py-1 text-xs font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((cell, idx) =>
            cell === null ? (
              <div key={`empty-${idx}`} className="h-10" />
            ) : (
              <DayCell
                key={cell}
                day={cell}
                isToday={
                  cell === today.getDate() &&
                  currentMonth === today.getMonth() + 1 &&
                  currentYear === today.getFullYear()
                }
                events={eventMap.get(cell) ?? []}
              />
            )
          )}
        </div>
      </CardContent>
    </Card>
  )
}
