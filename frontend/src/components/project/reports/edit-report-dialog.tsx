import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { updateReportSchema } from '@/validation/report.schema'
import type { Report } from '@/services/project/api-student-report'

interface EditReportDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  report: Report | null
  onSubmit: (id: string, notes: string) => Promise<void>
}

export function EditReportDialog({ isOpen, setIsOpen, report, onSubmit }: EditReportDialogProps) {
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && report) {
      setNotes(report.notes || '')
      setError(null)
    }
  }, [isOpen, report])

  const handleSubmit = async () => {
    if (!report) return

    try {
      const parsedData = updateReportSchema.parse({ notes })
      setError(null)
      setIsSubmitting(true)

      await onSubmit(report._id, parsedData.notes)
      setIsOpen(false)
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message || "Validation failed")
      } else {
        const backendError = err?.response?.data?.error || err?.response?.data?.message;
        toast.error(backendError || err?.message || "Failed to update report")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Report Metadata</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Version</Label>
            <p className="font-medium text-sm">{report?.versionLabel}</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="editNotes">Notes & Changelog <span className="text-destructive">*</span></Label>
            <Textarea 
              id="editNotes" 
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className={`h-28 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {error && <span className="text-xs text-destructive">{error}</span>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
