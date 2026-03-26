import { useState, useMemo, useEffect, useCallback } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { TaskRow } from './task-row'
import { AddTaskDialog } from './task-dialog'
import type { Task } from '../types'
import type { Contributor } from '@/services/project/api-project'
import type { CalendarMeeting } from '@/components/project/meeting-calendar/calendar/calendar-types'
import { getTasksByUserStory } from '@/services/project/api-task'

interface TaskTableProps {
  userStoryId: string
  contributors: Contributor[]
  currentUserId: string
  onCreateMeeting: (
    meeting: Omit<CalendarMeeting, 'id' | 'color'> & { color?: string }
  ) => void
  onTaskCountChange?: (count: number) => void
}

function TaskTable({
  userStoryId,
  contributors,
  currentUserId,
  onCreateMeeting,
  onTaskCountChange,
}: TaskTableProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchTasks = useCallback(async () => {
    if (!userStoryId) return
    setLoading(true)
    try {
      const data = await getTasksByUserStory(userStoryId)
      setTasks(data)
      onTaskCountChange?.(data.length)
    } catch {
      setTasks([])
      onTaskCountChange?.(0)
    } finally {
      setLoading(false)
    }
  }, [userStoryId, onTaskCountChange])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const filtered = useMemo(() =>
    tasks.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase())
    ), [tasks, search])

  return (
    <div className="flex flex-col gap-3 mt-4 px-1">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">
          Tasks {!loading && `(${tasks.length})`}
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="pl-8 h-8 text-sm w-44"
            />
          </div>
          <AddTaskDialog userStoryId={userStoryId} contributors={contributors} onSuccess={fetchTasks} />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 border-b text-left">
              <th className="py-2 pl-4 pr-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
              <th className="py-2 pr-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Description</th>
              <th className="py-2 pr-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="py-2 pr-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Priority</th>
              <th className="py-2 pr-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Assignee</th>
              <th className="py-2 pr-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  contributors={contributors}
                  onRefresh={fetchTasks}
                  currentUserId={currentUserId}
                  onCreateMeeting={onCreateMeeting}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                  {search ? 'No tasks match your search.' : 'No tasks yet. Click "+ Add Task"!'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TaskTable