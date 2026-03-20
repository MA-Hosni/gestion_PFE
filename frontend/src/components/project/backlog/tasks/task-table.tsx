import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { TaskRow } from './task-row'
import { AddTaskDialog } from './task-dialog'
import { mockTasks } from './mock-tasks'
import type { Task } from '../types'

interface TaskTableProps {
  tasks?: Task[]
}

function TaskTable({ tasks: propTasks }: TaskTableProps) {
  const [tasks, setTasks] = useState<Task[]>(propTasks ?? mockTasks)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() =>
    tasks.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee.toLowerCase().includes(search.toLowerCase())
    ), [tasks, search])

  const handleAdd = (draft: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, { ...draft, id: `task-${Date.now()}` }])
  }

  const handleSave = (updated: Task) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="flex flex-col gap-3 mt-4 px-1">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">Tasks</h3>
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
          <AddTaskDialog onAdd={handleAdd} />
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
            {filtered.length > 0 ? (
              filtered.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onSave={handleSave}
                  onDelete={handleDelete}
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