import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
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
import { useFormContext, useWatch } from "react-hook-form"
import { toast } from "sonner"

import * as authApi from "@/services/auth/auth-api"
import type { SignupValues } from "@/lib/validation/signup-validation"
import { fileToBase64 } from "@/lib/file-to-base64"

interface SignupFormStep2Props {
  onNext: () => void
  onPrev: () => void
}

const degreeTypeByDegree: Record<
  "Engineer" | "Master" | "Bachelor",
  string[]
> = {
  Engineer: ["INLOG", "INREV"],
  Master: ["Pro IM", "Pro DCA", "Pro PAR", "R DISR", "R TMAC"],
  Bachelor: ["AV", "CMM", "IMM", "BD", "MIME", "Coco-JV", "Coco-3D"],
}

export function SignupFormStep2({ onNext, onPrev }: SignupFormStep2Props) {
  const {
    setValue,
    trigger,
    register,
    formState: { errors },
  } = useFormContext<SignupValues>()

  const role = useWatch({ name: "role" }) as SignupValues["role"]
  const degree = useWatch({ name: "degree" }) as SignupValues["degree"]
  const degreeType = useWatch({ name: "degreeType" }) as SignupValues["degreeType"]
  const uniSupervisorId = useWatch({ name: "uniSupervisorId" }) as SignupValues["uniSupervisorId"]
  const compSupervisorId = useWatch({ name: "compSupervisorId" }) as SignupValues["compSupervisorId"]

  const [companySupervisors, setCompanySupervisors] = useState<
    authApi.SupervisorLite[]
  >([])
  const [universitySupervisors, setUniversitySupervisors] = useState<
    authApi.SupervisorLite[]
  >([])
  const [isLoadingSupervisors, setIsLoadingSupervisors] = useState(false)

  useEffect(() => {
    let active = true

    ;(async () => {
      if (role !== "Student") return

      setIsLoadingSupervisors(true)
      try {
        const [company, university] = await Promise.all([
          authApi.getCompanySupervisors(),
          authApi.getUniversitySupervisors(),
        ])
        if (!active) return
        setCompanySupervisors(company.data)
        setUniversitySupervisors(university.data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load supervisors"
        toast.error(message)
      } finally {
        if (active) setIsLoadingSupervisors(false)
      }
    })()

    return () => {
      active = false
    }
  }, [role])

  const degreeTypeOptions = useMemo(() => {
    if (!degree) return []
    return degreeTypeByDegree[degree]
  }, [degree])

  const handleNext = async () => {
    if (role === "Student") {
      const ok = await trigger([
        "cin",
        "studentIdCardIMG",
        "degree",
        "degreeType",
        "companyName",
        "uniSupervisorId",
        "compSupervisorId",
      ])
      if (ok) onNext()
      return
    }

    if (role === "CompSupervisor") {
      const ok = await trigger(["companyName", "badgeIMG"])
      if (ok) onNext()
      return
    }

    const ok = await trigger(["badgeIMG"])
    if (ok) onNext()
  }

  const onStudentIdFileChange = async (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Student ID card must be an image file")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Student ID card image is too large (max 2MB)")
      return
    }

    const base64 = await fileToBase64(file)
    setValue("studentIdCardIMG", base64, { shouldValidate: true })
  }

  const onBadgeFileChange = async (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Badge must be an image file")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Badge image is too large (max 2MB)")
      return
    }

    const base64 = await fileToBase64(file)
    setValue("badgeIMG", base64, { shouldValidate: true })
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <FieldGroup>
        {role === "Student" ? (
          <>
            <Field>
              <FieldLabel htmlFor="cin">CIN</FieldLabel>
              <Input
                id="cin"
                type="text"
                placeholder="12345678"
                autoComplete="off"
                aria-invalid={!!errors.cin}
                {...register("cin")}
              />
              {errors.cin?.message ? <FieldError>{errors.cin.message}</FieldError> : null}
            </Field>

            <Field>
              <FieldLabel htmlFor="studentIdCardIMG">Student ID Card</FieldLabel>
              <Input
                id="studentIdCardIMG"
                type="file"
                accept="image/*"
                aria-invalid={!!errors.studentIdCardIMG}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  void onStudentIdFileChange(file)
                }}
              />
              <FieldDescription>Select a picture to upload.</FieldDescription>
              {errors.studentIdCardIMG?.message ? (
                <FieldError>{errors.studentIdCardIMG.message}</FieldError>
              ) : null}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="degree">Degree</FieldLabel>
                <Select
                  value={degree ?? ""}
                  onValueChange={(v) => setValue("degree", v as SignupValues["degree"], { shouldValidate: true })}
                >
                  <SelectTrigger id="degree">
                    <SelectValue placeholder="Select a degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bachelor">Bachelor</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="Engineer">Engineering</SelectItem>
                  </SelectContent>
                </Select>
                {errors.degree?.message ? <FieldError>{errors.degree.message}</FieldError> : null}
              </Field>

              <Field>
                <FieldLabel htmlFor="degreeType">Degree Type</FieldLabel>
                <Select
                  value={degreeType ?? ""}
                  onValueChange={(v) =>
                    setValue("degreeType", v, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="degreeType">
                    <SelectValue placeholder="Select a degree type" />
                  </SelectTrigger>
                  <SelectContent>
                    {degreeTypeOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.degreeType?.message ? <FieldError>{errors.degreeType.message}</FieldError> : null}
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="companyName">Company</FieldLabel>
              <Input
                id="companyName"
                type="text"
                placeholder="Company of internship"
                aria-invalid={!!errors.companyName}
                {...register("companyName")}
              />
              {errors.companyName?.message ? (
                <FieldError>{errors.companyName.message}</FieldError>
              ) : null}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="uniSupervisorId">University Supervisor</FieldLabel>
                <Select
                  value={uniSupervisorId ?? ""}
                  onValueChange={(v) =>
                    setValue("uniSupervisorId", v, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="uniSupervisorId">
                    <SelectValue
                      placeholder={
                        isLoadingSupervisors ? "Loading..." : "Select a university supervisor"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {universitySupervisors.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.uniSupervisorId?.message ? (
                  <FieldError>{errors.uniSupervisorId.message}</FieldError>
                ) : null}
              </Field>

              <Field>
                <FieldLabel htmlFor="compSupervisorId">Company Supervisor</FieldLabel>
                <Select
                  value={compSupervisorId ?? ""}
                  onValueChange={(v) =>
                    setValue("compSupervisorId", v, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="compSupervisorId">
                    <SelectValue
                      placeholder={
                        isLoadingSupervisors ? "Loading..." : "Select a company supervisor"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {companySupervisors.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.compSupervisorId?.message ? (
                  <FieldError>{errors.compSupervisorId.message}</FieldError>
                ) : null}
              </Field>
            </div>
          </>
        ) : null}

        {role === "CompSupervisor" ? (
          <>
            <Field>
              <FieldLabel htmlFor="companyName">Company</FieldLabel>
              <Input
                id="companyName"
                type="text"
                placeholder="Company name"
                aria-invalid={!!errors.companyName}
                {...register("companyName")}
              />
              {errors.companyName?.message ? (
                <FieldError>{errors.companyName.message}</FieldError>
              ) : null}
            </Field>

            <Field>
              <FieldLabel htmlFor="badgeIMG">Working badge image</FieldLabel>
              <Input
                id="badgeIMG"
                type="file"
                accept="image/*"
                aria-invalid={!!errors.badgeIMG}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  void onBadgeFileChange(file)
                }}
              />
              <FieldDescription>Select a badge image to upload.</FieldDescription>
              {errors.badgeIMG?.message ? (
                <FieldError>{errors.badgeIMG.message}</FieldError>
              ) : null}
            </Field>
          </>
        ) : null}

        {role === "UniSupervisor" ? (
          <>
            <Field>
              <FieldLabel htmlFor="badgeIMG">University badge image</FieldLabel>
              <Input
                id="badgeIMG"
                type="file"
                accept="image/*"
                aria-invalid={!!errors.badgeIMG}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  void onBadgeFileChange(file)
                }}
              />
              <FieldDescription>Select a badge image to upload.</FieldDescription>
              {errors.badgeIMG?.message ? (
                <FieldError>{errors.badgeIMG.message}</FieldError>
              ) : null}
            </Field>
          </>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Button
              type="button"
              variant="outline"
              onClick={onPrev}
              className="w-full"
            >
              <ArrowLeft className="mr-2 size-4" /> Back
            </Button>
          </Field>
          <Field>
            <Button type="button" className="w-full" onClick={handleNext}>
              Next <ArrowRight className="ml-2 size-4" />
            </Button>
          </Field>
        </div>
      </FieldGroup>
    </div>
  )
}
