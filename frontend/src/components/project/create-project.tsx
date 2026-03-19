import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function CreateNewProject() {

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 20),
        to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
    })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Create New Project</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Project</SheetTitle>
          <SheetDescription>Create your project here. Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="project-title">Project Title</Label>
            <Input id="project-title" name="title" required />
          </div>
          <div className="grid gap-3">
            <FieldLabel htmlFor="project-description">Description</FieldLabel>
            <Textarea id="project-description" className="resize-none" />
          </div>
          <div className="grid gap-3">
            <FieldLabel htmlFor="date-picker-range">
                Project Date Range
            </FieldLabel>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="date-picker-range"
                    className="justify-start px-2.5 font-normal"
                >
                    <CalendarIcon />
                    {date?.from ? (
                    date.to ? (
                        <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(date.from, "LLL dd, y")
                    )
                    ) : (
                    <span>Pick a date</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-3">
            <Field>
                <FieldLabel>Contributors</FieldLabel>
                <MultiSelect
              
                >
                <MultiSelectTrigger className="w-full">
                    <MultiSelectValue overflowBehavior="wrap" placeholder="Select contributors..." />
                </MultiSelectTrigger>
                <MultiSelectContent>
                    <MultiSelectGroup>
                    <MultiSelectItem value="next.js">Next.js</MultiSelectItem>
                    <MultiSelectItem value="sveltekit">SvelteKit</MultiSelectItem>
                    <MultiSelectItem value="nuxt.js">Nuxt.js</MultiSelectItem>
                    <MultiSelectItem value="remix">Remix</MultiSelectItem>
                    <MultiSelectItem value="astro">Astro</MultiSelectItem>
                    <MultiSelectItem value="vue">Vue</MultiSelectItem>
                    <MultiSelectItem value="remi">Remi</MultiSelectItem>
                    <MultiSelectItem value="asto">Asto</MultiSelectItem>
                    <MultiSelectItem value="v">V</MultiSelectItem>
                    </MultiSelectGroup>
                </MultiSelectContent>
                </MultiSelect>
            </Field>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
