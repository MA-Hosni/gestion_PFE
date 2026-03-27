import { FileText, Trash2, Edit, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import type { Report } from '@/services/project/api-student-report'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ReportGridProps {
  reports: Report[]
  onOpenReport: (filePath: string) => void
  onEditClick: (report: Report) => void
  onDeleteClick: (report: Report) => void
}

export function ReportGrid({ reports, onOpenReport, onEditClick, onDeleteClick }: ReportGridProps) {
  const formatDate = (iso: string) => {
    try { return format(new Date(iso), 'MMM dd, yyyy') } catch { return iso }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {reports.map(report => (
        <div 
          key={report._id} 
          className="group flex flex-col bg-background border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer relative"
          onClick={() => onOpenReport(report.filePath)}
        >
          {/* Actions Hover Layer */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md z-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-7 w-7 bg-white hover:bg-white text-zinc-700 shadow border"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 text-sm">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onEditClick(report);
                  }}
                  className="cursor-pointer font-medium"
                >
                  <Edit className="mr-2 h-4 w-4 opacity-70" />
                  Edit Notes
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onDeleteClick(report);
                  }}
                  className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-medium"
                >
                  <Trash2 className="mr-2 h-4 w-4 opacity-70" />
                  Delete Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Thumbnail Area - Drive Red styling for PDFs */}
          <div className="h-32 bg-[#F1F3F4] border-b flex items-center justify-center relative overflow-hidden group-hover:bg-[#E8EAED] transition-colors">
            <div className="w-16 h-20 bg-white border shadow-sm rounded flex items-center justify-center relative">
              <div className="absolute top-0 right-0 w-4 h-4 bg-muted border-b border-l rounded-bl pointer-events-none" />
              <FileText className="h-8 w-8 text-red-500/80" />
            </div>
          </div>

          {/* Details Area */}
          <div className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-red-500 shrink-0" />
              <h4 className="text-sm font-medium truncate" title={`Version ${report.versionLabel}`}>
                Version {report.versionLabel}
              </h4>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
              <span>{formatDate(report.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
