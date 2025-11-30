import * as dashboardService from '../services/dashboard.service.js';
import { StatusCodes } from 'http-status-codes';

export const getAllProjects = async (req, res, next) => {
  try {
    const studentIds = req.supervisor.studentsId;
    const result = await dashboardService.getAllProjects(studentIds);
    
    return res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message,
      count: result.data.length,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};