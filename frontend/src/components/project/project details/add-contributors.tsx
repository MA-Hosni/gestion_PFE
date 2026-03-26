import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"
import { Loader2 } from "lucide-react"

export interface AvailableUser {
  _id: string
  fullName: string
}

interface AddContributorsDialogProps {
  onAdd: (selectedUserIds: string[]) => Promise<void>
  availableUsers: AvailableUser[]
}

export function AddContributorsDialog({ onAdd, availableUsers }: AddContributorsDialogProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      await onAdd(selectedUsers)
      setOpen(false)
      setSelectedUsers([])
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Contributors</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Contributors</DialogTitle>
            <DialogDescription>
              Select students to add to this project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="contributors">Contributors</Label>
              <MultiSelect values={selectedUsers} onValuesChange={setSelectedUsers}>
                <MultiSelectTrigger id="contributors" className="w-full">
                    <MultiSelectValue placeholder={availableUsers.length === 0 ? "No available students" : "Select contributors..."} />
                </MultiSelectTrigger>
                <MultiSelectContent>
                    <MultiSelectGroup>
                        {availableUsers.map((user) => (
                            <MultiSelectItem key={user._id} value={user._id}>
                                {user.fullName}
                            </MultiSelectItem>
                        ))}
                    </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSubmitting || selectedUsers.length === 0}>
               {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Add
            </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
