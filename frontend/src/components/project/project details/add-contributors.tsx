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

// Mock data - in a real app this might come from an API
export const availableUsers = [
  { id: "1", name: "Olivia Sparks", initials: "OS", avatar: "" },
  { id: "2", name: "Howard Lloyd", initials: "HL", avatar: "" },
  { id: "3", name: "Hallie Richards", initials: "HR", avatar: "" },
  { id: "4", name: "Jenny Wilson", initials: "JW", avatar: "" },
  { id: "5", name: "Adam Smith", initials: "AS", avatar: "" },
  { id: "6", name: "John Doe", initials: "JD", avatar: "" },
  { id: "7", name: "Sarah Connor", initials: "SC", avatar: "" },
  { id: "8", name: "Mike Ross", initials: "MR", avatar: "" },
]

interface AddContributorsDialogProps {
  onAdd: (selectedUserIds: string[]) => void
}

export function AddContributorsDialog({ onAdd }: AddContributorsDialogProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    onAdd(selectedUsers)
    setOpen(false)
    setSelectedUsers([])
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
              Select team members to add to this project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="contributors">Contributors</Label>
              <MultiSelect values={selectedUsers} onValuesChange={setSelectedUsers}>
                <MultiSelectTrigger id="contributors" className="w-full">
                    <MultiSelectValue placeholder="Select contributors..." />
                </MultiSelectTrigger>
                <MultiSelectContent>
                    <MultiSelectGroup>
                        {availableUsers.map((user) => (
                            <MultiSelectItem key={user.id} value={user.id}>
                                {user.name}
                            </MultiSelectItem>
                        ))}
                    </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Add</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
