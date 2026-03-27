import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { createReportSchema } from '@/validation/report.schema'

interface CreateReportDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onSubmit: (formData: FormData) => Promise<void>
}

export function CreateReportDialog({ isOpen, setIsOpen, onSubmit }: CreateReportDialogProps) {
  const [versionLabel, setVersionLabel] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ versionLabel?: string, notes?: string }>({})
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setVersionLabel('1')
      setNotes('')
      setSelectedFile(null)
      setErrors({})
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [isOpen])

  const handleSubmit = async () => {
    setErrors({})

    try {
      const parsedData = createReportSchema.parse({
        versionLabel: versionLabel ? Number(versionLabel) : undefined,
        notes,
      })

      if (!selectedFile) {
        toast.error("Please upload a PDF file.")
        return
      }

      setIsSubmitting(true)

      const formData = new FormData()
      formData.append('versionLabel', parsedData.versionLabel.toString())
      formData.append('notes', parsedData.notes)
      formData.append('file', selectedFile)

      await onSubmit(formData)
      setIsOpen(false)
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { versionLabel?: string; notes?: string } = {}

        for (const issue of err.issues) {
          const field = issue.path[0]?.toString()
          if (field && !fieldErrors[field as keyof typeof fieldErrors]) {
            fieldErrors[field as keyof typeof fieldErrors] = issue.message
          }
        }

        setErrors(fieldErrors)

        if (fieldErrors.versionLabel) {
          toast.error(fieldErrors.versionLabel)
          return
        }

        if (fieldErrors.notes) {
          toast.error(fieldErrors.notes)
          return
        }

        toast.error("Validation failed. Please check your inputs.")
        return
      }

      const backendError = err?.response?.data?.error || err?.response?.data?.message;
      toast.error(backendError || err?.message || "Failed to upload report")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload New Report</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="version">Version Number</Label>
            <Input 
              id="version" 
              type="number"
              min={1}
              placeholder="e.g. 1" 
              value={versionLabel}
              onChange={e => setVersionLabel(e.target.value)}
              className={errors.versionLabel ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.versionLabel && <span className="text-xs text-destructive">{errors.versionLabel}</span>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="file">PDF Document</Label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileText className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-1 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Click to upload</span>
                  </p>
                  <p className="text-xs text-muted-foreground text-center px-4">
                    {selectedFile ? <span className="text-primary font-medium">{selectedFile.name}</span> : "PDF (Max 10MB)"}
                  </p>
                </div>
                <input 
                  id="dropzone-file" 
                  type="file" 
                  className="hidden" 
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                      setSelectedFile(e.target.files[0])
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes & Changelog</Label>
            <Textarea 
              id="notes" 
              placeholder="Describe what changed (min 3 chars)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className={`h-20 resize-none ${errors.notes ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.notes && <span className="text-xs text-destructive">{errors.notes}</span>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Upload Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
