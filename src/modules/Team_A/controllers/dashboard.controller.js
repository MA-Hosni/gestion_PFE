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

export const getDashboard = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Project ID is required' });
        }

        const [timeline, stats] = await Promise.all([
            dashboardService.getTimeline(projectId),
            dashboardService.getStats(projectId)
        ]);

        res.status(StatusCodes.OK).json({
            success: true,
            data: {
                timeline,
                stats
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};
