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

export const getProgress = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const result = await dashboardService.getProgress(projectId);

    return res.status(StatusCodes.OK).json({
      success: result.success,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentTimeline = async (req, res, next) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            const error = new Error("Month and Year are required");
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const projectId = req.student.project;
        if(!projectId) {
            const error = new Error("Student is not assigned to any project");
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }
        
        const timeline = await dashboardService.getStudentTimeline(
            req.student.id,
            projectId,
            parseInt(month),
            parseInt(year)
        );

        return res.status(StatusCodes.OK).json({
            success: true,
            count: timeline.length,
            data: timeline
        });
    } catch (error) {
        next(error);
    }
};

export const getSupervisorTimeline = async (req, res, next) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            const error = new Error("Month and Year are required");
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const studentsId = req.supervisor.studentsId;
        if(!studentsId || studentsId.length === 0) {
            const error = new Error("Supervisor has no assigned students");
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const timeline = await dashboardService.getSupervisorTimeline(
            req.supervisor.id,
            studentsId,
            parseInt(month),
            parseInt(year)
        );

        return res.status(StatusCodes.OK).json({
            success: true,
            count: timeline.length,
            data: timeline
        });
    } catch (error) {
        next(error);
    }
};

export const getStudentStandbyTasks = async (req, res, next) => {
    try {
        const projectId = req.student.project;
        if (!projectId) {
            return res.status(StatusCodes.OK).json({
                success: true,
                count: 0,
                data: []
            });
        }

        const tasks = await dashboardService.getStandbyTasks(projectId);

        return res.status(StatusCodes.OK).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

export const getSupervisorPendingValidations = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        if (!projectId) {
            const error = new Error("Project ID is required");
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const tasks = await dashboardService.getPendingValidations(projectId);

        return res.status(StatusCodes.OK).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

export const getSupervisorLatestMeetings = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        if (!projectId) {
            const error = new Error("Project ID is required");
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const meetings = await dashboardService.getLatestMeetings(projectId);

        return res.status(StatusCodes.OK).json({
            success: true,
            count: meetings.length,
            data: meetings
        });
    } catch (error) {
        next(error);
    }
};