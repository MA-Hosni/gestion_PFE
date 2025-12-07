import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";
import User from "../../modules/Authentication/models/user.models.js";
import Student from "../../modules/Authentication/models/student.model.js";
import CompSupervisor from "../../modules/Authentication/models/compSupervisor.model.js";
import UniSupervisor from "../../modules/Authentication/models/uniSupervisor.model.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      const error = new Error("Access token is required");
      error.status = 401;
      throw error;
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      const error = new Error("Access token is required");
      error.status = 401;
      throw error;
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      const error = new Error("Invalid or expired access token");
      error.status = 401;
      throw error;
    }
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      const error = new Error("User not found");
      error.status = 401;
      throw error;
    }
    
    if (!user.isActive) {
      const error = new Error("User account is deactivated");
      error.status = 401;
      throw error;
    }
    
    if (!user.isVerified) {
      const error = new Error("Please verify your email before accessing this resource");
      error.status = 403;
      throw error;
    }
    
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      isVerified: user.isVerified
    };
    
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeStudent = async (req, res, next) => {
  try {
    // Check if user is authenticated (set by authenticateToken middleware)
    if (!req.user) {
      const error = new Error("Authentication required");
      error.status = 401;
      throw error;
    }

    // Check if user has student role
    if (req.user.role !== "Student") {
      const error = new Error("Access denied. Only students can access this resource");
      error.status = 403;
      throw error;
    }

    // Get student document with userId
    const student = await Student.findOne({ userId: req.user.id }).select('-__v');

    if (!student) {
      const error = new Error("Student profile not found");
      error.status = 404;
      throw error;
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
      throw error;
    }

    // Check if user is not a student
    if (req.user.role === "Student") {
      const error = new Error("Access denied. Only Supervisors can access this resource");
      error.status = 403;
      throw error;
    }

    let supervisor = null;
    // if (req.user.role === "CompSupervisor") {
    if (req.user.role === "CompSupervisor") {
      supervisor = await CompSupervisor.findOne({ userId: req.user.id }).select('-__v');
      if (!supervisor) {
        const error = new Error("Company supervisor profile not found");
        error.status = 404;
        throw error;
      }
      req.supervisor = {
        id: supervisor._id,
        userId: supervisor.userId,
        companyName: supervisor.companyName,
        studentsId: supervisor.studentsId,
      };
    //} else if (req.user.role === "UniSupervisor") {
    } else if (req.user.role === "UniSupervisor") {
      supervisor = await UniSupervisor.findOne({ userId: req.user.id }).select('-__v');
      if (!supervisor) {
        const error = new Error("University supervisor profile not found");
        error.status = 404;
        throw error;
      }
      req.supervisor = {
        id: supervisor._id,
        userId: supervisor.userId,
        studentsId: supervisor.studentsId,
      };
    } else {
      const error = new Error("Access denied. Only Company or University Supervisors can access this resource");
      error.status = 403;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeUniversitySupervisor = async (req, res, next) => {
  try {
    // Must be authenticated
    if (!req.user) {
      const error = new Error("Authentication required");
      error.status = 401;
      throw error;
    }

    // Role must be strictly 'uniSupervisor'
    if (req.user.role !== "uniSupervisor") {
      const error = new Error("Access denied. Only University Supervisors can access this resource");
      error.status = 403;
      throw error;
    }

    // Fetch university supervisor profile
    const uniSupervisor = await UniSupervisor.findOne({ userId: req.user.id }).select("-__v");

    if (!uniSupervisor) {
      const error = new Error("University supervisor profile not found");
      error.status = 404;
      throw error;
    }

    // Attach supervisor data to request
    req.universitySupervisor = {
      id: uniSupervisor._id,
      userId: uniSupervisor.userId,
      studentsId: uniSupervisor.studentsId,
    };

    next();

  } catch (error) {
    next(error);
  }
};
