import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { Report } from '@/services/project/api-student-report'

interface DeleteReportDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  report: Report | null
  onSubmit: (id: string) => Promise<void>
}

export function DeleteReportDialog({ isOpen, setIsOpen, report, onSubmit }: DeleteReportDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!report) return
    try {
      setIsSubmitting(true)
      await onSubmit(report._id)
      setIsOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Report</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>Version {report?.versionLabel}</strong>? 
            This action moves it to the trash and it will no longer be visible here.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>Cancel</Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
