import * as reportService from "../services/report.service.js";
import { StatusCodes } from "http-status-codes";

// CREATE REPORT
export const createReport = async (req, res, next) => {
  try {
    const studentId = req.student.id;
    
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "File is required",
      });
    }

    const result = await reportService.createReport(
      studentId,
      req.validatedBody,
      req.file  
    );

    res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

// GET ALL
export const getAllReports = async (req, res, next) => {
  try {
    const studentId = req.student.id;
    const result = await reportService.getAllReports(studentId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

// GET BY ID
export const getReportById = async (req, res, next) => {
  try {
    const studentId = req.student.id;
    const reportId = req.params.id;

    const result = await reportService.getReportById(studentId, reportId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteReport = async (req, res, next) => {
  try {
    const studentId = req.student.id;
    const reportId = req.params.id;

    const result = await reportService.deleteReport(studentId, reportId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
