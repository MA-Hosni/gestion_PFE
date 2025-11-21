// Team_D/services/meeting.service.js

import mongoose from "mongoose";
import Meeting from "../models/meeting.model.js";
import Student from "../../Team_A/models/student.model.js"; // only if needed for referencing
import Project from "../../Team_A/models/project.model.js"; // if needed for queries

export default class MeetingService {

    // =========================================================
    // 1. CREATE MEETING
    // =========================================================
    static async createMeeting(data, studentId) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { scheduled_date, agenda, reference_type, reference_id } = data;

            const newMeeting = await Meeting.create(
                [{
                    scheduled_date,
                    agenda,
                    reference_type,
                    reference_id,
                    created_by: studentId
                }],
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return {
                success: true,
                message: "Meeting created successfully",
                data: newMeeting[0]
            };

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }



    // =========================================================
    // 2. UPDATE MEETING
    // Only creator can update
    // =========================================================
    static async updateMeeting(meetingId, studentId, data) {
        const meeting = await Meeting.findById(meetingId);

        if (!meeting || meeting.deletedAt)
            return { success: false, status: 404, message: "Meeting not found" };

        if (meeting.created_by.toString() !== studentId)
            return { success: false, status: 403, message: "Only the creator can update this meeting" };

        Object.assign(meeting, data);
        await meeting.save();

        return {
            success: true,
            message: "Meeting updated successfully",
            data: meeting
        };
    }



    // =========================================================
    // 3. DELETE MEETING (Soft delete)
    // Cannot delete if validated
    // =========================================================
    static async deleteMeeting(meetingId, studentId) {
        const meeting = await Meeting.findById(meetingId);

        if (!meeting || meeting.deletedAt)
            return { success: false, status: 404, message: "Meeting not found" };

        if (meeting.created_by.toString() !== studentId)
            return { success: false, status: 403, message: "Only the creator can delete this meeting" };

        if (meeting.validation_status === "valid")
            return { success: false, status: 409, message: "Cannot delete a validated meeting" };

        meeting.deletedAt = new Date();
        await meeting.save();

        return {
            success: true,
            message: "Meeting deleted successfully"
        };
    }



    // =========================================================
    // 4. COMPLETE MEETING (Actual minutes)
    // =========================================================
    static async completeMeeting(meetingId, studentId, data) {
        const { actual_minutes } = data;

        if (!actual_minutes)
            return { success: false, status: 400, message: "Actual minutes are required" };

        const meeting = await Meeting.findById(meetingId);

        if (!meeting || meeting.deletedAt)
            return { success: false, status: 404, message: "Meeting not found" };

        if (meeting.created_by.toString() !== studentId)
            return { success: false, status: 403, message: "Only the creator can complete this meeting" };

        meeting.actual_minutes = actual_minutes;
        await meeting.save();

        return {
            success: true,
            message: "Meeting minutes saved successfully",
            data: meeting
        };
    }



    // =========================================================
    // 5. VALIDATE MEETING (Enc_University)
    // =========================================================
    static async validateMeeting(meetingId, validatorId, validation_status) {
        const meeting = await Meeting.findById(meetingId);

        if (!meeting || meeting.deletedAt)
            return { success: false, status: 404, message: "Meeting not found" };

        if (!["valid", "invalid"].includes(validation_status))
            return { success: false, status: 400, message: "Invalid validation status" };

        meeting.validation_status = validation_status;
        meeting.validator_id = validatorId;
        await meeting.save();

        return {
            success: true,
            message: "Meeting validation updated",
            data: meeting
        };
    }



    // =========================================================
    // 6. LIST MEETINGS BY PROJECT
    // =========================================================
    static async listMeetingsByProject(projectId) {
        const meetings = await Meeting.find({
            deletedAt: null,
            project_id: projectId
        });

        return {
            success: true,
            data: meetings
        };
    }



    // =========================================================
    // 7. LIST MEETINGS BY REFERENCE
    // (user_story | task | report)
    // =========================================================
    static async listByReference(type, id) {
        if (!["user_story", "task", "report"].includes(type))
            return { success: false, status: 400, message: "Invalid reference type" };

        const meetings = await Meeting.find({
            reference_type: type,
            reference_id: id,
            deletedAt: null
        });

        if (!meetings)
            return { success: false, status: 404, message: "No meetings found for this reference" };

        return {
            success: true,
            data: meetings
        };
    }



    // =========================================================
    // 8. CHANGE MEETING REFERENCE
    // (creator only)
    // =========================================================
    static async changeReference(meetingId, studentId, newData) {
        const meeting = await Meeting.findById(meetingId);

        if (!meeting || meeting.deletedAt)
            return { success: false, status: 404, message: "Meeting not found" };

        if (meeting.created_by.toString() !== studentId)
            return { success: false, status: 403, message: "Only creator can change the reference" };

        const { reference_type, reference_id } = newData;

        meeting.reference_type = reference_type;
        meeting.reference_id = reference_id;

        await meeting.save();

        return {
            success: true,
            message: "Meeting reference updated successfully",
            data: meeting
        };
    }



    // =========================================================
    // 9. LIST PENDING VALIDATION (Enc_University)
    // =========================================================
    static async listPendingValidation(projectId) {
        const meetings = await Meeting.find({
            validation_status: "pending",
            project_id: projectId,
            deletedAt: null
        }).populate("created_by", "firstName lastName");

        return {
            success: true,
            data: meetings
        };
    }
}
