import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface SignupFormStep2Props extends React.ComponentProps<"form"> {
  onNext: () => void
  onPrev: () => void
}

const fieldsByDegree: Record<string, string[]> = {
  bc: ["AV", "CMM", "IMM", "BD", "MIME", "Coco_JV", "Coco_3D"],
  ms: ["Pro_IM", "Pro_DCA", "Pro_PAR", "R_DISR", "R_TMAC"],
  eng: ["INLOG", "INREV"],
}

export function SignupFormStep2({
  className,
  onNext,
  onPrev,
  ...props
}: SignupFormStep2Props) {
  const [selectedDegree, setSelectedDegree] = useState("bc")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add validation logic here
    onNext()
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="cin">CIN</FieldLabel>
          <Input id="cin" type="text" placeholder="12345678" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="picture">Student ID Card</FieldLabel>
          <Input id="picture" type="file" required/>
          <FieldDescription>Select a picture to upload.</FieldDescription>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="degree">Degree</FieldLabel>
            <Select defaultValue="bc" required onValueChange={setSelectedDegree}>
              <SelectTrigger id="degree">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bc">Bachelor</SelectItem>
                <SelectItem value="ms">Master</SelectItem>
                <SelectItem value="eng">Engineering</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="field">Field</FieldLabel>
            <Select required>
              <SelectTrigger id="field">
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                {fieldsByDegree[selectedDegree]?.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="company">Company</FieldLabel>
          <Input id="company" type="text" required />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="uni-supervisor">University Supervisor</FieldLabel>
            <Select required>
              <SelectTrigger id="uni-supervisor">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mc">Mohamed chedli</SelectItem>
                <SelectItem value="bm">bibou midou</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="comp-supervisor">Company Supervisor</FieldLabel>
            <Select required>
              <SelectTrigger id="comp-supervisor">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mc">Mohamed chedli</SelectItem>
                <SelectItem value="bm">bibou midou</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Button type="button" variant="outline" onClick={onPrev} className="w-full">
              <ArrowLeft className="mr-2 size-4" /> Back
            </Button>
          </Field>
          <Field>
            <Button type="submit" className="w-full">
              Next <ArrowRight className="ml-2 size-4" />
            </Button>
          </Field>  
        </div>
      </FieldGroup>
    </form>
  )
}
