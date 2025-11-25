import * as userStoryService from "../services/UserStory.service.js";
import { StatusCodes } from "http-status-codes";

export const createUserStory = async (req, res, next) => {
  try {
    const userId = req.user.id;           // from authenticateToken
    const sprintId = req.params.idSprint; // from route
    const body = req.validatedBody;       // from Joi validator

    const result = await userStoryService.creatUS(userId, sprintId, body);

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
      data: result.data || undefined
    });

  } catch (error) {
    next(error);
  }
};