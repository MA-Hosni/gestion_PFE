import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import type { CalendarMeeting } from '@/components/project/meeting-calendar/calendar/calendar-types'
import type { MeetingReferenceType } from '@/lib/meeting'
import { getMeetingColor } from '@/lib/meeting'
import {
  completeMeeting as apiCompleteMeeting,
  createMeeting as apiCreateMeeting,
  deleteMeeting as apiDeleteMeeting,
  getStudentMeetings,
  updateMeeting as apiUpdateMeeting,
} from '@/services/project/api-meeting'
import type {
  Meeting,
  CompleteMeetingPayload,
} from '@/services/project/api-meeting'

interface UseMeetingsOptions {
  autoFetch?: boolean
  currentUserId: string
  projectId?: string
}

export interface CreateMeetingInput {
  agenda: string
  scheduledDate: Date
  referenceType: MeetingReferenceType
  referenceId: string
  actualMinutes?: string
}

export interface UpdateMeetingInput {
  agenda?: string
  scheduledDate?: Date
  actualMinutes?: string
  referenceType?: MeetingReferenceType
  referenceId?: string
}

type MutationState = {
  creating: boolean
  updating: Record<string, boolean>
  deleting: Record<string, boolean>
  completing: Record<string, boolean>
}

const initialMutationState: MutationState = {
  creating: false,
  updating: {},
  deleting: {},
  completing: {},
}

const safeDate = (value?: string | Date | null): Date => {
  if (!value) return new Date()
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? new Date() : date
}

const mapMeetingToCalendar = (meeting: Meeting): CalendarMeeting => {
  return {
    id: meeting.id,
    agenda: meeting.agenda,
    color: getMeetingColor(meeting.referenceType),
    scheduledDate: safeDate(meeting.scheduledDate),
    referenceType: meeting.referenceType,
    referenceId: meeting.referenceId,
    createdBy: meeting.createdBy,
    actualMinutes: meeting.actualMinutes,
    validationStatus: meeting.validationStatus,
    validatorId: meeting.validatorId,
    projectId: meeting.projectId,
    createdAt: meeting.createdAt ? safeDate(meeting.createdAt) : null,
    updatedAt: meeting.updatedAt ? safeDate(meeting.updatedAt) : null,
  }
}

export function useMeetings({ autoFetch = true, currentUserId, projectId }: UseMeetingsOptions) {
  const [meetings, setMeetings] = useState<CalendarMeeting[]>([])
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState<string | null>(null)
  const [mutations, setMutations] = useState<MutationState>(initialMutationState)

  const meetingsRef = useRef<CalendarMeeting[]>([])
  useEffect(() => {
    meetingsRef.current = meetings
  }, [meetings])

  const setMutation = useCallback((type: keyof MutationState, meetingId?: string, value?: boolean) => {
    setMutations(prev => {
      if (type === 'creating') {
        return { ...prev, creating: Boolean(value) }
      }
      const record = { ...prev[type] }
      if (meetingId) {
        if (value) {
          record[meetingId] = true
        } else {
          delete record[meetingId]
        }
      }
      return { ...prev, [type]: record }
    })
  }, [])

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getStudentMeetings()
      setMeetings(data.map(mapMeetingToCalendar))
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to load meetings'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (autoFetch) {
      fetchMeetings()
    }
  }, [autoFetch, fetchMeetings])

  const optimisticMeeting = useCallback((input: CreateMeetingInput, tempId: string): CalendarMeeting => {
    return {
      id: tempId,
      agenda: input.agenda,
      color: getMeetingColor(input.referenceType),
      scheduledDate: input.scheduledDate,
      referenceType: input.referenceType,
      referenceId: input.referenceId,
      createdBy: currentUserId,
      actualMinutes: input.actualMinutes ?? null,
      validationStatus: 'pending',
      validatorId: null,
      projectId: projectId ?? '',
      createdAt: null,
      updatedAt: null,
    }
  }, [currentUserId, projectId])

  const createMeeting = useCallback(async (input: CreateMeetingInput) => {
    const tempId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? `temp-${crypto.randomUUID()}`
      : `temp-${Date.now()}`

    const optimistic = optimisticMeeting(input, tempId)
    setMutation('creating', undefined, true)
    setMeetings(prev => [...prev, optimistic])

    try {
      const payload = {
        agenda: input.agenda,
        scheduledDate: input.scheduledDate.toISOString(),
        referenceType: input.referenceType,
        referenceId: input.referenceId,
        actualMinutes: input.actualMinutes,
      }
      const created = await apiCreateMeeting(payload)
      const calendarMeeting = mapMeetingToCalendar(created)
      setMeetings(prev => prev.map(meeting => meeting.id === tempId ? calendarMeeting : meeting))
      return calendarMeeting
    } catch (err: any) {
      setMeetings(prev => prev.filter(meeting => meeting.id !== tempId))
      const message = err?.response?.data?.message || 'Failed to create meeting'
      toast.error(message)
      throw err
    } finally {
      setMutation('creating', undefined, false)
    }
  }, [optimisticMeeting, setMutation])

  const updateMeeting = useCallback(async (meetingId: string, input: UpdateMeetingInput) => {
    const previous = meetingsRef.current.find(meeting => meeting.id === meetingId)
    if (!previous) return null

    const pendingUpdate: Partial<CalendarMeeting> = {
      agenda: input.agenda ?? previous.agenda,
      scheduledDate: input.scheduledDate ?? previous.scheduledDate,
      actualMinutes: input.actualMinutes ?? previous.actualMinutes,
      referenceType: input.referenceType ?? previous.referenceType,
      referenceId: input.referenceId ?? previous.referenceId,
      color: getMeetingColor(input.referenceType ?? previous.referenceType),
    }

    setMutation('updating', meetingId, true)
    setMeetings(prev => prev.map(meeting => meeting.id === meetingId ? { ...meeting, ...pendingUpdate } : meeting))

    try {
      const payload = {
        ...('agenda' in input ? { agenda: input.agenda } : {}),
        ...('scheduledDate' in input && input.scheduledDate ? { scheduledDate: input.scheduledDate.toISOString() } : {}),
        ...('actualMinutes' in input ? { actualMinutes: input.actualMinutes } : {}),
        ...('referenceType' in input ? { referenceType: input.referenceType } : {}),
        ...('referenceId' in input ? { referenceId: input.referenceId } : {}),
      }
      const updated = await apiUpdateMeeting(meetingId, payload)
      const mapped = mapMeetingToCalendar(updated)
      setMeetings(prev => prev.map(meeting => meeting.id === meetingId ? mapped : meeting))
      return mapped
    } catch (err: any) {
      setMeetings(prev => prev.map(meeting => meeting.id === meetingId ? previous : meeting))
      const message = err?.response?.data?.message || 'Failed to update meeting'
      toast.error(message)
      throw err
    } finally {
      setMutation('updating', meetingId, false)
    }
  }, [setMutation])

  const deleteMeeting = useCallback(async (meetingId: string) => {
    const previous = meetingsRef.current
    setMutation('deleting', meetingId, true)
    setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId))
    try {
      await apiDeleteMeeting(meetingId)
    } catch (err: any) {
      setMeetings(previous)
      const message = err?.response?.data?.message || 'Failed to delete meeting'
      toast.error(message)
      throw err
    } finally {
      setMutation('deleting', meetingId, false)
    }
  }, [setMutation])

  const completeMeeting = useCallback(async (meetingId: string, payload: CompleteMeetingPayload) => {
    setMutation('completing', meetingId, true)
    try {
      const completed = await apiCompleteMeeting(meetingId, payload)
      const mapped = mapMeetingToCalendar(completed)
      setMeetings(prev => prev.map(meeting => meeting.id === meetingId ? mapped : meeting))
      return mapped
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to complete meeting'
      toast.error(message)
      throw err
    } finally {
      setMutation('completing', meetingId, false)
    }
  }, [setMutation])

  const mutationFlags = useMemo(() => ({
    creating: mutations.creating,
    updatingIds: Object.keys(mutations.updating),
    deletingIds: Object.keys(mutations.deleting),
    completingIds: Object.keys(mutations.completing),
  }), [mutations])

  return {
    meetings,
    setMeetings,
    loading,
    error,
    refresh: fetchMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    completeMeeting,
    mutationState: mutationFlags,
  }
}
