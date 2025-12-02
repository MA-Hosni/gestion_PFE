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

// Get all User Stories of the student's project
export const getUserStories = async (req, res, next) => {
  try {
    const projectId = req.student.project;
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

// Get all User Stories related to a specific sprint
export const getUserStoriesRelatedToSprint = async (req, res, next) => {
  try {

    const { sprintId } = req.params;
    const projectId = req.student.project;

    const result = await userStoryService.getUserStoriesRelatedToSprint(projectId , sprintId);

    res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
}

// get US By ID 
// Get User Story by ID
// Get User Story by ID
export const getUserStoryById = async (req, res, next) => {
  try {
    const { userStoryId } = req.params;
    const projectId = req.student.project;

    const result = await userStoryService.getUserStoryByID(userStoryId,projectId);

    res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};
// Update User Story 
export const updateUserStory = async (req, res, next) => {
  try {

    const { userStoryId } = req.params;
    const updateData = req.validatedBody;
    const studentId  = req.student.id;

    const result = await userStoryService.updateUserStory(userStoryId , updateData , studentId  );

    res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
}

// Delete User Story
export const deleteUserStory = async (req, res, next) => {
  try {
    const { userStoryId } = req.params;
    const studentId = req.student.id;

    const result = await userStoryService.deleteUserStory(
      userStoryId,
      studentId
    );

    res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};