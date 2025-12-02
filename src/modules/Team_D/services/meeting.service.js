import mongoose from "mongoose";
import Meeting from "../models/meeting.model.js";
import Task from "../../Team_C/models/task.model.js";
import Sprint from "../../Team_A/models/sprint.model.js";
import Project from "../../Team_A/models/project.model.js";
import Report from "../../Team_B/models/report.model.js";
import UserStory from "../../Team_B/models/UserStory.model.js";
import Student from "../../Authentication/models/student.model.js";

//
// =========================================================
// 1. CREATE MEETING
// =========================================================
export const createMeeting = async (data, studentId) => {
  const { scheduledDate, agenda, referenceType, referenceId } = data;

  if (!scheduledDate || !referenceType) {
    return {
      success: false,
      code: 400,
      message: "scheduledDate and referenceType are required"
    };
  }

  let projectId = null;

  // USER STORY
  if (referenceType === "user_story") {
    const us = await UserStory.findById(referenceId);
    if (!us) return { success: false, code: 404, message: "User Story not found" };

    const sprint = us.sprintId ? await Sprint.findById(us.sprintId) : null;
    projectId = sprint?.projectId || null;

  // TASK
  } else if (referenceType === "task") {
    const task = await Task.findById(referenceId);
    if (!task) return { success: false, code: 404, message: "Task not found" };

    const us = await UserStory.findById(task.userStoryId);
    if (!us) return { success: false, code: 404, message: "User Story for Task not found" };

    const sprint = await Sprint.findById(us.sprintId);
    projectId = sprint.projectId;

  // REPORT
  } else if (referenceType === "report") {
    const report = await Report.findById(referenceId);
    if (!report) return { success: false, code: 404, message: "Report not found" };

    projectId = report.projectId;
  }

  if (!projectId) {
    return { success: false, code: 400, message: "Unable to determine project" };
  }

  // CREATE MEETING
  const newMeeting = await Meeting.create({
    scheduledDate,
    agenda,
    referenceType,
    referenceId,
    projectId,
    createdBy: studentId
  });

  const student = await Student.findById(studentId);
  if (!student) {
    return { success: false, code: 404, message: "Student not found" };
  }

  student.meetings.push(newMeeting._id);
  await student.save();

  return {
    success: true,
    message: "Meeting created successfully",
    data: newMeeting
  };
};

//
// =========================================================
// 2. UPDATE MEETING
// =========================================================
export const updateMeeting = async (meetingId, studentId, data) => {
  if (!mongoose.Types.ObjectId.isValid(meetingId)) {
    return { success: false, code: 400, message: "Invalid meeting ID" };
  }

  const meeting = await Meeting.findById(meetingId);

  if (!meeting || meeting.deletedAt) {
    return { success: false, code: 404, message: "Meeting not found" };
  }

  if (!meeting.createdBy.equals(studentId)) {
    return { success: false, code: 403, message: "You cannot update this meeting" };
  }

  // If reference changed, validate the new one
  if (data.referenceType && data.referenceId) {
    if (!mongoose.Types.ObjectId.isValid(data.referenceId)) {
      return { success: false, code: 400, message: "Invalid referenceId" };
    }

    if (data.referenceType === "user_story") {
      const us = await UserStory.findById(data.referenceId);
      if (!us) return { success: false, code: 404, message: "User Story not found" };

    } else if (data.referenceType === "task") {
      const task = await Task.findById(data.referenceId);
      if (!task) return { success: false, code: 404, message: "Task not found" };

    } else if (data.referenceType === "report") {
      const report = await Report.findById(data.referenceId);
      if (!report) return { success: false, code: 404, message: "Report not found" };
    }
  }

  Object.assign(meeting, data);
  await meeting.save();

  return {
    success: true,
    message: "Meeting updated successfully",
    data: meeting
  };
};

//
// =========================================================
// 3. DELETE MEETING
// =========================================================
export const deleteMeeting = async (meetingId, studentId) => {
  if (!mongoose.Types.ObjectId.isValid(meetingId)) {
    return { success: false, code: 400, message: "Invalid meeting ID" };
  }

  const meeting = await Meeting.findById(meetingId);

  if (!meeting || meeting.deletedAt) {
    return { success: false, code: 404, message: "Meeting not found" };
  }

  if (!meeting.createdBy.equals(studentId)) {
    return { success: false, code: 403, message: "You cannot delete this meeting" };
  }

  if (meeting.validationStatus === "valid") {
    return { success: false, code: 409, message: "Cannot delete a validated meeting" };
  }

  meeting.deletedAt = new Date();
  await meeting.save();

  return { success: true, message: "Meeting deleted successfully" };
};

//
// =========================================================
// 4. COMPLETE MEETING
// =========================================================
export const completeMeeting = async (meetingId, studentId, data) => {
  const { actualMinutes } = data;

  if (!actualMinutes) {
    return { success: false, code: 400, message: "actualMinutes is required" };
  }

  const meeting = await Meeting.findById(meetingId);

  if (!meeting || meeting.deletedAt) {
    return { success: false, code: 404, message: "Meeting not found" };
  }

  if (!meeting.createdBy.equals(studentId)) {
    return { success: false, code: 403, message: "You cannot complete this meeting" };
  }

  meeting.actualMinutes = actualMinutes;
  await meeting.save();

  return {
    success: true,
    message: "Meeting completed successfully",
    data: meeting
  };
};

//
// =========================================================
// 5. VALIDATE MEETING
// =========================================================
export const validateMeeting = async (meetingId, validatorId, status) => {
  if (!mongoose.Types.ObjectId.isValid(meetingId)) {
    return { success: false, code: 400, message: "Invalid meeting ID" };
  }

  const meeting = await Meeting.findById(meetingId);

  if (!meeting || meeting.deletedAt) {
    return { success: false, code: 404, message: "Meeting not found" };
  }

  if (!["valid", "invalid"].includes(status)) {
    return { success: false, code: 400, message: "Invalid validation status" };
  }

  meeting.validationStatus = status;
  meeting.validatorId = validatorId;
  await meeting.save();

  return {
    success: true,
    message: "Meeting validation updated",
    data: meeting
  };
};

//
// =========================================================
// 6. LIST BY STUDENT
// =========================================================
export const listMeetingsByStudent = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    return { success: false, code: 404, message: "Student not found" };
  }

  const meetings = await Meeting.find({
    createdBy: studentId,
    deletedAt: null
  });

  return { success: true, data: meetings };
};

//
// =========================================================
// 7. LIST BY PROJECT
// =========================================================
export const listMeetingsByProject = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    return { success: false, code: 404, message: "Project not found" };
  }

  const meetings = await Meeting.find({
    deletedAt: null,
    projectId
  });

  return { success: true, data: meetings };
};

//
// =========================================================
// 8. LIST BY REFERENCE
// =========================================================
export const listMeetingsByReference = async (referenceType, referenceId) => {
  if (!["user_story", "task", "report"].includes(referenceType)) {
    return { success: false, code: 400, message: "Invalid reference type" };
  }

  if (!mongoose.Types.ObjectId.isValid(referenceId)) {
    return { success: false, code: 400, message: "Invalid reference ID" };
  }

  // Validate the referenced object exists
  if (referenceType === "user_story") {
    const us = await UserStory.findById(referenceId);
    if (!us) return { success: false, code: 404, message: "User Story not found" };

  } else if (referenceType === "task") {
    const task = await Task.findById(referenceId);
    if (!task) return { success: false, code: 404, message: "Task not found" };

  } else if (referenceType === "report") {
    const report = await Report.findById(referenceId);
    if (!report) return { success: false, code: 404, message: "Report not found" };
  }

  const meetings = await Meeting.find({
    referenceType,
    referenceId,
    deletedAt: null
  });

  return { success: true, data: meetings };
};

//
// =========================================================
// 9. CHANGE REFERENCE
// =========================================================
export const changeReference = async (meetingId, studentId, data) => {
  const { referenceType, referenceId } = data;

  if (!["user_story", "task", "report"].includes(referenceType)) {
    return { success: false, code: 400, message: "Invalid reference type" };
  }

  const meeting = await Meeting.findById(meetingId);

  if (!meeting || meeting.deletedAt) {
    return { success: false, code: 404, message: "Meeting not found" };
  }

  if (!meeting.createdBy.equals(studentId)) {
    return { success: false, code: 403, message: "You cannot change meeting reference" };
  }

  // Validate reference exists
  if (referenceType === "user_story") {
    const us = await UserStory.findById(referenceId);
    if (!us) return { success: false, code: 404, message: "User Story not found" };

  } else if (referenceType === "task") {
    const task = await Task.findById(referenceId);
    if (!task) return { success: false, code: 404, message: "Task not found" };

  } else if (referenceType === "report") {
    const report = await Report.findById(referenceId);
    if (!report) return { success: false, code: 404, message: "Report not found" };
  }

  meeting.referenceType = referenceType;
  meeting.referenceId = referenceId;
  await meeting.save();

  return {
    success: true,
    message: "Reference updated successfully",
    data: meeting
  };
};

//
// =========================================================
// 10. LIST PENDING VALIDATION
// =========================================================
export const listPendingValidation = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    return { success: false, code: 404, message: "Project not found" };
  }

  const meetings = await Meeting.find({
    projectId,
    validationStatus: "pending",
    deletedAt: null
  }).populate("createdBy", "firstName lastName");

  return { success: true, data: meetings };
};
