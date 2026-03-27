import api from "../http/api-client"
import type { MeetingReferenceType, MeetingValidationStatus } from "@/lib/meeting"

export interface MeetingDTO {
  _id?: string
  id?: string
  scheduledDate: string
  agenda: string
  actualMinutes?: string | null
  referenceType: MeetingReferenceType
  referenceId: string
  createdBy: string | { _id?: string }
  validationStatus: MeetingValidationStatus
  validatorId?: string | null
  projectId: string | { _id?: string }
  deletedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface Meeting {
  id: string
  scheduledDate: string
  agenda: string
  actualMinutes: string | null
  referenceType: MeetingReferenceType
  referenceId: string
  createdBy: string
  validationStatus: MeetingValidationStatus
  validatorId: string | null
  projectId: string
  deletedAt: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface CreateMeetingPayload {
  scheduledDate: string
  agenda: string
  referenceType: MeetingReferenceType
  referenceId: string
  actualMinutes?: string
}

export type UpdateMeetingPayload = Partial<{
  scheduledDate: string
  agenda: string
  actualMinutes: string
  referenceType: MeetingReferenceType
  referenceId: string
}>

export interface CompleteMeetingPayload {
  actualMinutes: string
}

const MEETING_API_BASE = "/api/meetings"

function normalizeId(value?: string | { _id?: string } | null): string {
  if (!value) return ""
  if (typeof value === "string") return value
  return value._id ?? ""
}

function mapMeeting(meeting: MeetingDTO): Meeting {
  return {
    id: meeting._id ?? meeting.id ?? "",
    scheduledDate: meeting.scheduledDate,
    agenda: meeting.agenda ?? "",
    actualMinutes: meeting.actualMinutes ?? null,
    referenceType: meeting.referenceType,
    referenceId: meeting.referenceId,
    createdBy: normalizeId(meeting.createdBy) || "",
    validationStatus: meeting.validationStatus ?? "pending",
    validatorId: normalizeId(meeting.validatorId ?? null) || null,
    projectId: normalizeId(meeting.projectId) || "",
    deletedAt: meeting.deletedAt ?? null,
    createdAt: meeting.createdAt ?? null,
    updatedAt: meeting.updatedAt ?? null,
  }
}

function extractMeeting(responseData: any): Meeting {
  const raw = responseData?.data ?? responseData?.meeting ?? responseData
  if (!raw) {
    throw new Error("Missing meeting data in response")
  }
  return mapMeeting(raw)
}

function extractMeetings(responseData: any): Meeting[] {
  const raw = responseData?.data ?? responseData?.meetings ?? responseData
  if (!Array.isArray(raw)) {
    return []
  }
  return raw.map(mapMeeting)
}

export async function getStudentMeetings(): Promise<Meeting[]> {
  const response = await api.get(`${MEETING_API_BASE}`)
  return extractMeetings(response.data)
}

export async function getMeetingsByReference(type: MeetingReferenceType, referenceId: string): Promise<Meeting[]> {
  const response = await api.get(`${MEETING_API_BASE}/reference/${type}/${referenceId}`)
  return extractMeetings(response.data)
}

export async function createMeeting(payload: CreateMeetingPayload): Promise<Meeting> {
  const response = await api.post(MEETING_API_BASE, payload)
  return extractMeeting(response.data)
}

export async function updateMeeting(meetingId: string, payload: UpdateMeetingPayload): Promise<Meeting> {
  const response = await api.put(`${MEETING_API_BASE}/${meetingId}`, payload)
  return extractMeeting(response.data)
}

export async function deleteMeeting(meetingId: string): Promise<void> {
  await api.delete(`${MEETING_API_BASE}/${meetingId}`)
}

export async function completeMeeting(meetingId: string, payload: CompleteMeetingPayload): Promise<Meeting> {
  const response = await api.patch(`${MEETING_API_BASE}/${meetingId}/complete`, payload)
  return extractMeeting(response.data)
}
