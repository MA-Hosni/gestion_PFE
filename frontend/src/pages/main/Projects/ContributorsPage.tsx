import { useState, useMemo, useEffect } from 'react'
import { SearchIcon } from 'lucide-react'
import { AddContributorsDialog, type AvailableUser } from '@/components/project/project details/add-contributors'
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

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RemoveContributorDialog } from '@/components/project/project details/remove-contributor'
import { getStudentsWithoutProject, addContributors, removeContributors, type Project, type Contributor } from '@/services/project/api-project'
import { toast } from 'sonner'
import { useAuth } from '@/context/auth-context'

function getInitials(name: string) {
  if (!name) return "UN"
  const parts = name.split(" ")
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

interface ContributorsPageProps {
  project: Project
  setProject: React.Dispatch<React.SetStateAction<Project | null>>
}

const ContributorsPage = ({ project, setProject }: ContributorsPageProps) => {
  const { user } = useAuth()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([])

  useEffect(() => {
     async function loadAvailableUsers() {
        try {
           const users = await getStudentsWithoutProject()
           setAvailableUsers(users)
        } catch (err) {
           console.error("Failed to load available students:", err)
        }
     }
     loadAvailableUsers()
  }, [])

  const handleAdd = async (userIds: string[]) => {
    if (!project || userIds.length === 0) return
    try {
      await addContributors(project.projectId, userIds)
      
      const newContributors = availableUsers
        .filter(u => userIds.includes(u._id))
        .map(u => ({
             _id: u._id,
             fullName: u.fullName, 
             email: "Pending...",
        }))

      setProject(prev => {
         if (!prev) return null
         return {
            ...prev,
            contributors: [...prev.contributors, ...newContributors]
         }
      })
      
      setAvailableUsers(prev => prev.filter(u => !userIds.includes(u._id)))
    } catch (err) {
       console.error("Failed to add contributors", err)
    }
  }

  const handleRemove = async (id: string) => {
    if (!project) return
    try {
      await removeContributors(project.projectId, [id])
      
      const removedUser = project.contributors.find(c => c._id === id)
      
      setProject(prev => {
         if (!prev) return null
         return {
            ...prev,
            contributors: prev.contributors.filter(c => c._id !== id)
         }
      })
      
      if (removedUser) {
         setAvailableUsers(prev => [...prev, { _id: removedUser._id, fullName: removedUser.fullName }])
      }
      
      toast.success("Contributor removed successfully")
    } catch (err: any) {
       const message = err?.response?.data?.message || err?.message || "Failed to remove contributor"
       toast.error(message)
       throw err
    }
  }

  const columns = useMemo<ColumnDef<Contributor>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: 'Full Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Avatar className='rounded-full size-9 border flex items-center justify-center font-medium'>
              <AvatarFallback>{getInitials(row.original.fullName)}</AvatarFallback>
            </Avatar>
            <div className='font-medium'>{row.original.fullName}</div>
          </div>
        )
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <div className="text-muted-foreground">{row.original.email}</div>
      },
      {
        id: 'actions',
        cell: ({ row }) => {
            if (row.original._id === user?.id) return null
            return (
                <div className="flex justify-end pr-4">
                    <RemoveContributorDialog 
                        contributor={{ id: row.original._id, name: row.original.fullName }} 
                        onConfirm={handleRemove} 
                    />
                </div>
            )
        },
      }
    ],
    [project] 
  )

  const table = useReactTable({
    data: project.contributors,
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
                value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("fullName")?.setFilterValue(event.target.value)
                }
                className="pl-9 h-9"
             />
             <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <SearchIcon className="size-4" />
             </div>
          </div>
          <AddContributorsDialog onAdd={handleAdd} availableUsers={availableUsers} />
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