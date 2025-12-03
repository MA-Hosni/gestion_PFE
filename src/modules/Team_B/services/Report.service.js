import Report from "../models/report.model.js";
import Project from "../../Team_A/models/project.model.js";

export const createVersion = async (projectId, studentId, { versionNumber, notes, fileUrl }) => {
  // 1. vérifier projet
  const project = await Project.findOne({ _id: projectId, deletedAt: null });
  if (!project) {
    return { success: false, message: "Project not found", data: null };
  }

  // 2. Optionnel : vérifier unicité versionNumber pour ce projet
  const exists = await Report.findOne({ projectId, versionNumber, deletedAt: null });
  if (exists) {
    return { success: false, message: "Version number already exists", data: null };
  }

  const report = await Report.create({
    projectId,
    versionNumber,
    notes,
    fileUrl,
    uploadedBy: studentId
  });

  return { success: true, message: "Report version uploaded", data: report };
};

export const getAllVersions = async (projectId) => {
  const versions = await Report.find({ projectId, deletedAt: null }).sort({ versionNumber: -1 });
  return { success: true, message: "Versions retrieved", data: versions };
};

export const getVersionById = async (projectId, id) => {
  const v = await Report.findOne({ _id: id, projectId, deletedAt: null });
  if (!v) return { success: false, message: "Version not found", data: null };
  return { success: true, message: "Version found", data: v };
};

export const deleteVersion = async (projectId, id) => {
  const v = await Report.findOne({ _id: id, projectId, deletedAt: null });
  if (!v) return { success: false, message: "Version not found", data: null };
  v.deletedAt = new Date();
  await v.save();
  return { success: true, message: "Version deleted (soft)", data: null };
};
