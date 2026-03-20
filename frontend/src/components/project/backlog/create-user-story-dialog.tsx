import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export function AddUserStoryDialog() {

  const [startDate, setStartDate] = useState<Date>()
  const [dueDate, setDueDate] = useState<Date>()

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Create User Story
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create User Story</DialogTitle>
            <DialogDescription>
              Add a new user story.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="user-story-name">User Story Name</Label>
              <Input id="user-story-name" name="user-story-name" defaultValue="User Story 1" />
            </Field>
            <Field>
              <Label htmlFor="user-story-description">User Story Description</Label>
              <Textarea id="user-story-description" name="user-story-description" />
            </Field>
            <Field className="w-full">
              <FieldLabel htmlFor="date-picker-simple">Start Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker-simple"
                    className="justify-start font-normal"
                  >
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    defaultMonth={startDate}
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <Field className="w-full">
              <FieldLabel htmlFor="date-picker-simple">Due Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker-simple"
                    className="justify-start font-normal"
                  >
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    defaultMonth={dueDate}
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field>
                <Label htmlFor="user-story-priority">Priority</Label>
                <Select defaultValue="medium" name="user-story-priority">
                  <SelectTrigger id="user-story-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <Label htmlFor="user-story-points">Points Estimation</Label>
                <Input type="number" min={0} id="user-story-points" name="user-story-points" defaultValue="0" />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
