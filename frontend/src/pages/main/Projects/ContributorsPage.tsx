import { useState, useMemo } from 'react'
import { SearchIcon } from 'lucide-react'
import { AddContributorsDialog, availableUsers } from '@/components/project/project details/add-contributors'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RemoveContributorDialog } from '@/components/project/project details/remove-contributor'

type Contributor = {
  id: string
  name: string
  initials: string
  email: string
  avatar: string
}

const ContributorsPage = () => {
  const [contributors, setContributors] = useState<Contributor[]>([
    { id: "1", name: "Olivia Sparks", initials: "OS", email: "olivia.sparks@example.com", avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png" },
    { id: "2", name: "Howard Lloyd", initials: "HL", email: "howard.lloyd@example.com", avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png" },
    { id: "3", name: "Hallie Richards", initials: "HR", email: "hallie.richards@example.com", avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png" },
  ])

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const handleAdd = (userIds: string[]) => {
    const newContributors = availableUsers
        .filter(u => userIds.includes(u.id))
        // Check if user is already in the list
        .filter(u => !contributors.some(c => c.id === u.id))
        .map(u => ({
             id: u.id,
             name: u.name, 
             initials: u.initials,
             email: `${u.name.toLowerCase().replace(' ', '.')}@example.com`,
             avatar: u.avatar || "" 
        }))

    if (newContributors.length > 0) {
        setContributors(prev => [...prev, ...newContributors])
    }
  }

  const handleRemove = (id: string) => {
    setContributors(prev => prev.filter(c => c.id !== id))
  }

  const columns = useMemo<ColumnDef<Contributor>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Full Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Avatar className='rounded-full size-9 border'>
              <AvatarImage src={row.original.avatar} alt={row.original.name} />
              <AvatarFallback>{row.original.initials}</AvatarFallback>
            </Avatar>
            <div className='font-medium'>{row.getValue('name')}</div>
          </div>
        )
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('email')}</div>
      },
      {
        id: 'actions',
        cell: ({ row }) => {
            return (
                <div className="flex justify-end pr-4">
                    <RemoveContributorDialog 
                        contributor={row.original} 
                        onConfirm={handleRemove} 
                    />
                </div>
            )
        },
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] 
  )

  const table = useReactTable({
    data: contributors,
    columns,
    state: {
      sorting,
      columnFilters
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  })

  return (
    <div className='w-full space-y-4 pt-6'>
      <div className='flex items-center justify-between gap-4'>
          <div className='relative w-full max-w-sm'>
             <Input
                placeholder="Filter contributors..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="pl-9 h-9"
             />
             <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <SearchIcon className="size-4" />
             </div>
          </div>
          <AddContributorsDialog onAdd={handleAdd} />
      </div>
      
      <div className='rounded-md border bg-card'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className='bg-muted/40 hover:bg-muted/40'>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className='h-10 font-medium'>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center text-muted-foreground'>
                  No contributors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ContributorsPage