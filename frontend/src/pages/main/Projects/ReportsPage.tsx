import { useState, useEffect, useMemo } from 'react'
import { FileText, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import { 
  getAllReports, 
  createReport, 
  updateReportNotes, 
  deleteReport
} from '@/services/project/api-student-report'
import type { Report } from '@/services/project/api-student-report'
import api from '@/services/http/api-client'

import { ReportToolbar } from '@/components/project/reports/report-toolbar'
import { ReportGrid } from '@/components/project/reports/report-grid'
import { ReportList } from '@/components/project/reports/report-list'
import { CreateReportDialog } from '@/components/project/reports/create-report-dialog'
import { EditReportDialog } from '@/components/project/reports/edit-report-dialog'
import { DeleteReportDialog } from '@/components/project/reports/delete-report-dialog'

function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  const [activeReport, setActiveReport] = useState<Report | null>(null)

  const fetchReports = async () => {
    try {
      setLoading(true)
      const data = await getAllReports()
      setReports(data || [])
    } catch (err: any) {
      toast.error('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports
    const q = searchQuery.toLowerCase()
    return reports.filter(r => 
      r.versionLabel?.toString().includes(q) || 
      r.notes?.toLowerCase().includes(q)
    )
  }, [reports, searchQuery])

  const openReport = (filePath: string) => {
    const url = api.defaults.baseURL ? `${api.defaults.baseURL}${filePath}` : filePath;
    window.open(url, '_blank')
  }

  const handleCreateSubmit = async (formData: FormData) => {
    await createReport(formData)
    toast.success("Report uploaded successfully")
    fetchReports()
  }

  const handleEditSubmit = async (id: string, notes: string) => {
    await updateReportNotes(id, notes)
    toast.success("Report updated successfully")
    fetchReports()
  }

  const handleDeleteSubmit = async (id: string) => {
    await deleteReport(id)
    toast.success("Report moved to trash")
    fetchReports()
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-b-lg border-x border-b overflow-hidden shadow-sm">
      <ReportToolbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onCreateClick={() => setIsCreateOpen(true)}
      />

      <div className="flex-1 p-6 overflow-y-auto bg-muted/5 min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary/60" />
            <p>Loading your reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed rounded-xl bg-background mt-4 p-8">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No reports found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              {searchQuery ? "We couldn't find anything matching your search." : "You haven't uploaded any reports yet."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Upload Report
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <ReportGrid 
            reports={filteredReports} 
            onOpenReport={openReport}
            onEditClick={(report) => { setActiveReport(report); setIsEditOpen(true); }}
            onDeleteClick={(report) => { setActiveReport(report); setIsDeleteOpen(true); }}
          />
        ) : (
          <ReportList 
            reports={filteredReports} 
            onOpenReport={openReport}
            onEditClick={(report) => { setActiveReport(report); setIsEditOpen(true); }}
            onDeleteClick={(report) => { setActiveReport(report); setIsDeleteOpen(true); }}
          />
        )}
      </div>

      <CreateReportDialog 
        isOpen={isCreateOpen} 
        setIsOpen={setIsCreateOpen} 
        onSubmit={handleCreateSubmit} 
      />
      <EditReportDialog 
        isOpen={isEditOpen} 
        setIsOpen={setIsEditOpen} 
        report={activeReport} 
        onSubmit={handleEditSubmit} 
      />
      <DeleteReportDialog 
        isOpen={isDeleteOpen} 
        setIsOpen={setIsDeleteOpen} 
        report={activeReport} 
        onSubmit={handleDeleteSubmit} 
      />
    </div>
  )
}

export default ReportsPage