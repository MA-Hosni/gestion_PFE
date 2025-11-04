import * as userService from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";

export const getUserProfile = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        const error = new Error("User not authenticated");
        error.status = StatusCodes.UNAUTHORIZED;
        throw error;
      }
      
      const result = await userService.getUserProfile(userId);
      
      res.status(StatusCodes.OK).json({
        success: result.success,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.validatedBody;
        const userId = req.user.id;
        
        const result = await userService.changePassword(userId, currentPassword, newPassword);
        
        res.status(StatusCodes.OK).json({
        success: result.success,
        message: result.message
        });
    } catch (error) {
        next(error);
    }
};

export const getCompanySupervisors = async (req, res, next) => {
    try {
        const result = await userService.getCompanySupervisors();
        res.status(StatusCodes.OK).json({
        success: result.success,
        message: result.message,
        data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getUniversitySupervisors = async (req, res, next) => {
    try {
        const result = await userService.getUniversitySupervisors();
        res.status(StatusCodes.OK).json({
        success: result.success,
        message: result.message,
        data: result
        });
    } catch (error) {
        next(error);
    }
};