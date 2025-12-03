import * as reportService from "../services/Report.service.js";
import { StatusCodes } from "http-status-codes";

export const addReportVersion = async (req, res, next) => {
  try {
    const studentId = req.student.id;
    const projectId = req.student.project;
    const { versionNumber, notes } = req.body;

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "File is required" });
    }

    const fileUrl = `/uploads/reports/${req.file.filename}`; // chemin relatif

    const result = await reportService.createVersion(projectId, studentId, { versionNumber, notes, fileUrl });

    res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllVersions = async (req, res, next) => {
  try {
    const projectId = req.student.project;
    const result = await reportService.getAllVersions(projectId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getVersionById = async (req, res, next) => {
  try {
    const projectId = req.student.project;
    const id = req.params.id;
    const result = await reportService.getVersionById(projectId, id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteVersion = async (req, res, next) => {
  try {
    const projectId = req.student.project;
    const id = req.params.id;
    const result = await reportService.deleteVersion(projectId, id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
