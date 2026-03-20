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


export function SprintDialog({buttonText, title, description }: {buttonText: React.ReactNode, title: string, description: string }) {

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">{buttonText}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="sprint-name">Sprint Name</Label>
              <Input id="sprint-name" name="sprint-name" defaultValue="Sprint 1" />
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
              <FieldLabel htmlFor="date-picker-simple">End Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker-simple"
                    className="justify-start font-normal"
                  >
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    defaultMonth={endDate}
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <Field>
              <Label htmlFor="sprint-goal">Sprint Goal</Label>
              <Textarea id="sprint-goal" name="sprint-goal" defaultValue="" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{title.split(' ')[0]}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
