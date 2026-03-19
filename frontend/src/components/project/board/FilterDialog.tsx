import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FilterState, Priority, Status } from './types'
import { sprints, userStories, users } from './mockData'

interface FilterDialogProps {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  onOpenChange: (open: boolean) => void
}

export function FilterDialog({ filters, setFilters, onOpenChange }: FilterDialogProps) {
  const [activeCategory, setActiveCategory] = useState<'Sprint' | 'UserStory' | 'Assignee' | 'Priority' | 'Status'>('Sprint')
  const [searchFilter, setSearchFilter] = useState('')

  const handleCheckboxChange = (category: keyof FilterState, value: string) => {
    setFilters(prev => {
        const current = prev[category] as string[]
        const isSelected = current.includes(value)
        const updated = isSelected 
            ? current.filter(item => item !== value)
            : [...current, value]
        return { ...prev, [category]: updated }
    })
  }
  
  const filteredList = useMemo(() => {
      const search = searchFilter.toLowerCase()
      switch (activeCategory) {
          case 'Sprint':
              return sprints.filter(s => s.name.toLowerCase().includes(search))
          case 'UserStory':
              return userStories.filter(us => us.title.toLowerCase().includes(search))
          case 'Assignee':
              return users.filter(u => u.name.toLowerCase().includes(search))
          default:
              return []
      }
  }, [activeCategory, searchFilter])

  const renderContent = () => {
    if (activeCategory === 'Priority') {
        const allPriorities: Priority[] = ['Low', 'Medium', 'High']
        return (
            <div className="space-y-4 pt-4">
                {allPriorities.map(p => (
                    <div key={p} className="flex items-center space-x-2">
                        <Checkbox 
                            id={`priority-${p}`} 
                            checked={filters.priorities.includes(p)}
                            onCheckedChange={() => handleCheckboxChange('priorities', p)}
                        />
                        <Label htmlFor={`priority-${p}`} className="capitalize">{p}</Label>
                    </div>
                ))}
            </div>
        )
    }
    if (activeCategory === 'Status') {
        const allStatuses: Status[] = ['ToDo', 'InProgress', 'Standby', 'Done']
        return (
             <div className="space-y-4 pt-4">
                {allStatuses.map(s => (
                    <div key={s} className="flex items-center space-x-2">
                        <Checkbox 
                            id={`status-${s}`} 
                            checked={filters.statuses.includes(s)}
                            onCheckedChange={() => handleCheckboxChange('statuses', s)}
                        />
                         <Label htmlFor={`status-${s}`} className="capitalize">
                            {s === 'ToDo' ? 'To Do' : s === 'InProgress' ? 'In Progress' : s === 'Standby' ? 'Standby' : 'Done'}
                         </Label>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <div className="relative mb-4">
                <Input 
                    placeholder={`Search ${activeCategory === 'UserStory' ? 'user stories' : activeCategory.toLowerCase()}s...`} 
                    value={searchFilter} 
                    onChange={e => setSearchFilter(e.target.value)}
                    className="pl-9"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
                {activeCategory === 'Sprint' && filteredList.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-2">
                         <Checkbox 
                            id={item.id}
                            checked={filters.sprints.includes(item.id)}
                            onCheckedChange={() => handleCheckboxChange('sprints', item.id)}
                        />
                        <Label htmlFor={item.id} className="text-sm font-normal cursor-pointer flex-1 line-clamp-1">{item.name}</Label>
                    </div>
                ))}
                {activeCategory === 'UserStory' && filteredList.map((item: any) => (
                     <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox 
                           id={item.id}
                           checked={filters.userStories.includes(item.id)}
                           onCheckedChange={() => handleCheckboxChange('userStories', item.id)}
                       />
                       <Label htmlFor={item.id} className="text-sm font-normal cursor-pointer flex-1 line-clamp-1">{item.title}</Label>
                   </div>
                ))}
                {activeCategory === 'Assignee' && filteredList.map((item: any) => (
                     <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox 
                           id={item.id}
                           checked={filters.assignees.includes(item.id)}
                           onCheckedChange={() => handleCheckboxChange('assignees', item.id)}
                       />
                       <Avatar className="h-6 w-6">
                            <AvatarImage src={item.avatar} />
                            <AvatarFallback>{item.initials}</AvatarFallback>
                       </Avatar>
                       <Label htmlFor={item.id} className="text-sm font-normal cursor-pointer flex-1">{item.name}</Label>
                   </div>
                ))}
            </div>
        </div>
    )
  }

  return (
    <DialogContent className="max-w-3xl h-[600px] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Filter Tasks</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 overflow-hidden h-full">
            {/* Left Sidebar - 30% */}
            <div className="w-[30%] border-r bg-muted/30 p-2 space-y-1 overflow-y-auto">
                {(['Sprint', 'UserStory', 'Assignee', 'Priority', 'Status'] as const).map((category) => (
                    <Button
                        key={category}
                        variant={activeCategory === category ? "secondary" : "ghost"}
                        className="w-full justify-start text-sm"
                        onClick={() => {
                            setActiveCategory(category)
                            setSearchFilter("")
                        }}
                    >
                        {category === 'UserStory' ? 'User Story' : category}
                        {(category === 'Sprint' && filters.sprints.length > 0) ||
                         (category === 'UserStory' && filters.userStories.length > 0) ||
                         (category === 'Assignee' && filters.assignees.length > 0) ||
                         (category === 'Priority' && filters.priorities.length > 0) ||
                         (category === 'Status' && filters.statuses.length > 0) ? (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                         ) : null}
                    </Button>
                ))}
            </div>

            {/* Right Content - 70% */}
            <div className="w-[70%] p-6 overflow-hidden flex flex-col h-full">
                {renderContent()}
            </div>
        </div>
        <div className="p-4 border-t bg-muted/10 flex justify-between items-center">
             <Button 
                variant="ghost" 
                onClick={() => setFilters({ sprints: [], userStories: [], assignees: [], priorities: [], statuses: [] })}
            >
                Clear all
            </Button>
            <Button onClick={() => onOpenChange(false)}>Apply Filters</Button>
        </div>
    </DialogContent>
  )
}
