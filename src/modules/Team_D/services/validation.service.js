// services/validation.service.js
import Validation from "../models/validation.model.js";
import Task from "../models/task.model.js";
import Meeting from "../models/meeting.model.js";
import mongoose from "mongoose";

export const createValidation = async (data, validatorId) => {
  const {
    task_id,
    status,
    meeting_type,
    meeting_reference,
    comment
  } = data;

  // 1️⃣ Validate required fields
  if (!task_id || !status || !meeting_type) {
    return {
      success: false,
      code: 400,
      message: "Missing required fields"
    };
  }

  if (!mongoose.Types.ObjectId.isValid(task_id)) {
    return {
      success: false,
      code: 400,
      message: "Invalid task_id format"
    };
  }

  // 2️⃣ Check task exists
  const task = await Task.findById(task_id);
  if (!task) {
    return {
      success: false,
      code: 404,
      message: "Task not found"
    };
  }

  // 3️⃣ Task must be Done
  if (task.status !== "Done") {
    return {
      success: false,
      code: 400,
      message: "Task is not marked as 'Done'"
    };
  }

  // 4️⃣ If meeting type = reunion → meeting_reference must exist
  if (meeting_type === "reunion") {
    if (!meeting_reference || !mongoose.Types.ObjectId.isValid(meeting_reference)) {
      return {
        success: false,
        code: 400,
        message: "meeting_reference is required for reunion"
      };
    }

    const meeting = await Meeting.findById(meeting_reference);
    if (!meeting) {
      return {
        success: false,
        code: 404,
        message: "Meeting not found"
      };
    }
  }

  // 5️⃣ Create validation entry
  const validation = await Validation.create({
    task_id,
    status,
    validator_id: validatorId,
    meeting_type,
    meeting_reference: meeting_reference || null,
    comment
  });

  return {
    success: true,
    message: "Validation created successfully",
    data: validation
  };
};


export const getValidationsByTask = async (taskId) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return {
      success: false,
      code: 400,
      message: "Invalid taskId format"
    };
  }

  const validations = await Validation.find({
    task_id: taskId,
    deletedAt: null
  }).sort({ createdAt: -1 });

  return {
    success: true,
    message: "Validations fetched successfully",
    data: validations
  };
};


export const deleteValidation = async (id, requestingValidatorId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      success: false,
      code: 400,
      message: "Invalid validation ID"
    };
  }

  const validation = await Validation.findById(id);
  if (!validation || validation.deletedAt !== null) {
    return {
      success: false,
      code: 404,
      message: "Validation not found"
    };
  }

  // 403: Only original validator can delete
  if (validation.validator_id.toString() !== requestingValidatorId.toString()) {
    return {
      success: false,
      code: 403,
      message: "Only the original validator can cancel this validation"
    };
  }

  // Soft delete
  validation.deletedAt = new Date();
  await validation.save();

  return {
    success: true,
    message: "Validation deleted successfully"
  };
};
