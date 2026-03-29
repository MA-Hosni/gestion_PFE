import {
  FileText,
  Trash2,
  Edit,
  MoreVertical,
  Presentation,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import type { Report } from "@/services/project/api-student-report"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { CreateMeetingInput } from "@/hooks/use-meetings"
import { CreateMeetingDialog } from "../backlog/create-meeting-dialog"

interface ReportGridProps {
  reports: Report[]
  onOpenReport: (filePath: string) => void
  onEditClick: (report: Report) => void
  onDeleteClick: (report: Report) => void
  onCreateMeeting: (meeting: CreateMeetingInput) => Promise<unknown> | unknown
}

export function ReportGrid({
  reports,
  onOpenReport,
  onEditClick,
  onDeleteClick,
  onCreateMeeting,
}: ReportGridProps) {
  const formatDate = (iso: string) => {
    try {
      return format(new Date(iso), "MMM dd, yyyy")
    } catch {
      return iso
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {reports.map((report) => (
        <div
          key={report._id}
          className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md"
          onClick={() => onOpenReport(report.filePath)}
        >
          {/* Actions Hover Layer */}
          <div className="absolute top-2 right-2 z-20 opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-7 w-7 border bg-white text-zinc-700 shadow hover:bg-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 text-sm">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditClick(report)
                  }}
                  className="cursor-pointer font-medium"
                >
                  <Edit className="mr-2 h-4 w-4 opacity-70" />
                  Edit Notes
                </DropdownMenuItem>
                <CreateMeetingDialog
                  referenceType="report"
                  referenceId={report._id}
                  defaultAgenda={`Meeting: Version ${report.versionLabel}`}
                  onCreateMeeting={onCreateMeeting}
                  trigger={
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      onClick={(e) => e.stopPropagation()}
                      className="cursor-pointer font-medium"
                    >
                      <Presentation className="mr-2 h-4 w-4 opacity-70" />
                      Create Meeting
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteClick(report)
                  }}
                  className="cursor-pointer font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4 opacity-70" />
                  Delete Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Thumbnail Area - Drive Red styling for PDFs */}
          <div className="relative flex h-32 items-center justify-center overflow-hidden border-b bg-[#F1F3F4] transition-colors group-hover:bg-[#E8EAED]">
            <div className="relative flex h-20 w-16 items-center justify-center rounded border bg-white shadow-sm">
              <div className="pointer-events-none absolute top-0 right-0 h-4 w-4 rounded-bl border-b border-l bg-muted" />
              <FileText className="h-8 w-8 text-red-500/80" />
            </div>
          </div>

          {/* Details Area */}
          <div className="p-3">
            <div className="mb-1 flex items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-red-500" />
              <h4
                className="truncate text-sm font-medium"
                title={`Version ${report.versionLabel}`}
              >
                Version {report.versionLabel}
              </h4>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatDate(report.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
