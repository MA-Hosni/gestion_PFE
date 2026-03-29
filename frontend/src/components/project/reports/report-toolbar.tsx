import { Search, LayoutGrid, List as ListIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ReportToolbarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  onCreateClick: () => void
}

export function ReportToolbar({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onCreateClick
}: ReportToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 p-4 border-b bg-muted/10">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search reports by version or notes..." 
          className="pl-9 bg-background shadow-sm border-muted-foreground/20 rounded-full"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
        <div className="flex items-center border rounded-md mr-2 bg-background p-0.5 shadow-sm">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 rounded-sm ${viewMode === 'grid' ? 'bg-muted shadow-sm' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 rounded-sm ${viewMode === 'list' ? 'bg-muted shadow-sm' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          onClick={onCreateClick}
          className="rounded-full shadow-sm hover:shadow transition-shadow"
        >
          <Plus className="mr-2 h-4 w-4" /> New Report
        </Button>
      </div>
    </div>
  )
}
