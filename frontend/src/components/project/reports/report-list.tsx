import { FileText, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import type { Report } from '@/services/project/api-student-report'

interface ReportListProps {
  reports: Report[]
  onOpenReport: (filePath: string) => void
  onEditClick: (report: Report) => void
  onDeleteClick: (report: Report) => void
}

export function ReportList({ reports, onOpenReport, onEditClick, onDeleteClick }: ReportListProps) {
  const formatDate = (iso: string) => {
    try { return format(new Date(iso), 'MMM dd, yyyy') } catch { return iso }
  }

  return (
    <div className="bg-background border rounded-lg shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left">
            <th className="py-3 px-4 font-medium text-muted-foreground">Version</th>
            <th className="py-3 px-4 font-medium text-muted-foreground">Notes</th>
            <th className="py-3 px-4 font-medium text-muted-foreground">Last modified</th>
            <th className="py-3 px-4 font-medium text-muted-foreground w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, idx) => (
            <tr 
              key={report._id} 
              className={`border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}
              onClick={() => onOpenReport(report.filePath)}
            >
              <td className="py-3 px-4 font-medium">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-red-500 shrink-0" />
                  <span className="truncate max-w-[200px]">Version {report.versionLabel}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-muted-foreground max-w-[300px] truncate" title={report.notes}>
                {report.notes || '-'}
              </td>
              <td className="py-3 px-4 text-muted-foreground">
                {formatDate(report.updatedAt || report.createdAt)}
              </td>
              <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onEditClick(report)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDeleteClick(report)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
