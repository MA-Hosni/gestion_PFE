import * as userStoryService from "../services/UserStory.service.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

// Create User Story
export const createUserStory = async (req, res, next) => {
  try {
    const storyData = req.validatedBody;
    const studentId = req.student.id;

    const result = await userStoryService.createUserStory(storyData, studentId);

    res.status(StatusCodes.CREATED).json({
      success: result.success,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

// Get all User Stories for the student's project
export const getUserStories = async (req, res, next) => {
  try {
    const projectId = req.student.project;

    if (!projectId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No project assigned to your account"
      });
    }

    const result = await userStoryService.getUserStories(projectId);

    res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

// Update a User Story
export const updateUserStory = async (req, res, next) => {
  try {
    const storyId = req.params.id;
    const updates = req.validatedBody;
    const studentId = req.student.id;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid User Story ID"
      });
    }

    const result = await userStoryService.updateUserStory(storyId, updates, studentId);

    res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

// Delete User Story
export const deleteUserStory = async (req, res, next) => {
  try {
    const storyId = req.params.id;
    const studentId = req.student.id;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid User Story ID"
      });
    }

    const result = await userStoryService.deleteUserStory(storyId, studentId);

    res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

// Assign Sprint to User Story
export const assignSprint = async (req, res, next) => {
  try {
    const { storyId, sprintId } = req.body;
    const studentId = req.student.id;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid User Story ID"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(sprintId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid Sprint ID"
      });
    }

    const result = await userStoryService.assignSprint({ storyId, sprintId, studentId });

    res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};
