import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../shared/config/index.js";
import User from "../models/user.models.js";

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