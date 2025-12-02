import Student from "../../Authentication/models/student.model.js";
import CompSupervisor from "../../Authentication/models/compSupervisor.model.js";
import UniSupervisor from "../../Authentication/models/uniSupervisor.model.js";

export const authorizeStudent = async (req, res, next) => {
  try {
    // Check if user is authenticated (set by authenticateToken middleware)
    if (!req.user) {
      const error = new Error("Authentication required");
      error.status = 401;
      return next(error);
    }

    // Check if user has student role
    if (req.user.role !== "Student") {
      const error = new Error("Access denied. Only students can access this resource");
      error.status = 403;
      return next(error);
    }

    // Get student document with userId
    const student = await Student.findOne({ userId: req.user.id }).select('-__v');

    if (!student) {
      const error = new Error("Student profile not found");
      error.status = 404;
      return next(error);
    }

    // Attach student info to request
    req.student = {
      id: student._id,
      cin: student.cin,
      userId: student.userId,
      companyName: student.companyName,
      degree: student.degree,
      degreeType: student.degreeType,
      compSupervisorId: student.compSupervisorId,
      uniSupervisorId: student.uniSupervisorId,
      project: student.project
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeSupervisor = async (req, res, next) => {
  try {
    // Check if user is authenticated (set by authenticateToken middleware)
    if (!req.user) {
      const error = new Error("Authentication required");
      error.status = 401;
      return next(error);
    }

    // Check if user is not a student
    if (req.user.role === "Student") {
      const error = new Error("Access denied. Only Supervisors can access this resource");
      error.status = 403;
      return next(error);
    }

    let supervisor = null;
    if (req.user.role === "compSupervisor") {
      supervisor = await CompSupervisor.findOne({ userId: req.user.id }).select('-__v');
      if (!supervisor) {
        const error = new Error("Company supervisor profile not found");
        error.status = 404;
        return next(error);
      }
      req.supervisor = {
        id: supervisor._id,
        userId: supervisor.userId,
        companyName: supervisor.companyName,
        studentsId: supervisor.studentsId,
      };
    } else if (req.user.role === "uniSupervisor") {
      supervisor = await UniSupervisor.findOne({ userId: req.user.id }).select('-__v');
      if (!supervisor) {
        const error = new Error("University supervisor profile not found");
        error.status = 404;
        return next(error);
      }
      req.supervisor = {
        id: supervisor._id,
        userId: supervisor.userId,
        studentsId: supervisor.studentsId,
      };
    } else {
      const error = new Error("Access denied. Only Company or University Supervisors can access this resource");
      error.status = 403;
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
};