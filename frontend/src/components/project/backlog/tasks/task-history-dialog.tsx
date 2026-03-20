import { History, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { DialogTrigger } from '@/components/ui/dialog'
import { StatusBadge } from './task-badges'
import { mockTaskHistory } from './task-history'
import type { Task } from '../types'

interface TaskHistoryDialogProps {
  task: Task
}

export function TaskHistoryDialog({ task }: TaskHistoryDialogProps) {
  const history = mockTaskHistory[task.id] ?? []

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
          <History className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Status History</DialogTitle>
          <DialogDescription>
            Status changes for <span className="font-medium text-foreground">"{task.title}"</span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-0">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No status changes recorded yet.</p>
          ) : (
            <div className="relative border rounded-xl overflow-hidden">
              {/* Timeline */}
              <div className="divide-y">
                {history.map((entry, i) => (
                  <div key={entry.id} className="flex items-start gap-3 px-4 py-3">
                    {/* Dot + line */}
                    <div className="flex flex-col items-center mt-1 shrink-0">
                      <div className={`h-2.5 w-2.5 rounded-full border-2 ${i === 0 ? 'border-primary bg-primary' : 'border-muted-foreground bg-background'}`} />
                      {i < history.length - 1 && <div className="w-px flex-1 bg-border mt-1" style={{ minHeight: 24 }} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <StatusBadge status={entry.from} />
                        <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                        <StatusBadge status={entry.to} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Changed by{' '}
                        <span className="font-medium text-foreground">{entry.changedBy}</span>
                        {' · '}
                        {new Intl.DateTimeFormat('en-GB', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(new Date(entry.changedAt))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-end">
          <DialogClose asChild><Button variant="outline" size="sm">Close</Button></DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
