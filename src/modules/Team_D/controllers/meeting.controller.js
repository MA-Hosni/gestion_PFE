// Team_D/controllers/meeting.controller.js

import * as meetingService from "../services/meeting.service.js";
import { StatusCodes } from "http-status-codes";


// =========================================================
// 1. CREATE MEETING
// =========================================================
export const createMeeting = async (req, res, next) => {
  try {
    const meetingData = req.validatedBody;
    const studentId = req.student.id;

    const result = await meetingService.createMeeting(meetingData, studentId);

    res.status(StatusCodes.CREATED).json({
      success: result.success,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};


// =========================================================
// 2. UPDATE MEETING
// =========================================================
export const updateMeeting = async (req, res, next) => {
  try {
    const meetingId = req.params.id;
    const studentId = req.student.id;
    const updateData = req.validatedBody;

    const result = await meetingService.updateMeeting(meetingId, studentId, updateData);

    res.status(result.status || StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};


// =========================================================
// 3. DELETE MEETING
// =========================================================
export const deleteMeeting = async (req, res, next) => {
  try {
    const meetingId = req.params.id;
    const studentId = req.student.id;

    const result = await meetingService.deleteMeeting(meetingId, studentId);

    res.status(result.status || StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};


// =========================================================
// 4. COMPLETE MEETING (ADD ACTUAL MINUTES)
// =========================================================
export const completeMeeting = async (req, res, next) => {
  try {
    const meetingId = req.params.id;
    const studentId = req.student.id;
    const completionData = req.validatedBody;

    const result = await meetingService.completeMeeting(meetingId, studentId, completionData);

    res.status(result.status || StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};


// =========================================================
// 5. VALIDATE MEETING
// Enc_University ONLY
// =========================================================
export const validateMeeting = async (req, res, next) => {
  try {
    const meetingId = req.params.id;
    const validatorId = req.user.id;
    const { validation_status } = req.validatedBody;

    const result = await meetingService.validateMeeting(meetingId, validatorId, validation_status);

    res.status(result.status || StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};


// =========================================================
/** 6. LIST MEETINGS BY PROJECT */
// =========================================================
export const listMeetingsByProject = async (req, res, next) => {
  try {
    const projectId = req.query.project_id;

    const result = await meetingService.listMeetingsByProject(projectId);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};


// =========================================================
// 7. LIST MEETINGS BY REFERENCE (US | TASK | REPORT)
// =========================================================
export const listMeetingsByReference = async (req, res, next) => {
  try {
    const { type, id } = req.params;

    const result = await meetingService.listByReference(type, id);

    res.status(result.status || StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};


// =========================================================
// 8. CHANGE MEETING REFERENCE
// =========================================================
export const changeMeetingReference = async (req, res, next) => {
  try {
    const meetingId = req.params.id;
    const studentId = req.student.id;
    const newRefData = req.validatedBody;

    const result = await meetingService.changeReference(meetingId, studentId, newRefData);

    res.status(result.status || StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};


// =========================================================
// 9. LIST PENDING VALIDATION (Enc_University)
// =========================================================
export const listPendingValidation = async (req, res, next) => {
  try {
    const projectId = req.query.project_id;

    const result = await meetingService.listPendingValidation(projectId);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
