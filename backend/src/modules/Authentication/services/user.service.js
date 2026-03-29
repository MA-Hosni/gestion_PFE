import User from "../models/user.models.js";
import Student from "../models/student.model.js";
import CompSupervisor from "../models/compSupervisor.model.js";
import UniSupervisor from "../models/uniSupervisor.model.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

export const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    
    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      const error = new Error("Current password is incorrect");
      error.status = 400;
      throw error;
    }
    
    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update user password
    user.password = hashedPassword;
    await user.save();
    
    return {
      success: true,
      message: "Password changed successfully"
    };
};
  
export const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');

    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }

    let userProfile = null;
    switch (user.role) {
        case "Student":
        userProfile = await Student.findOne({ userId: user._id });
        break;
        case "CompSupervisor":
        userProfile = await CompSupervisor.findOne({ userId: user._id });
        break;
        case "UniSupervisor":
        userProfile = await UniSupervisor.findOne({ userId: user._id });
        break;
    }

    return {
        success: true,
        message: "User profile retrieved successfully",
        data: {
          user: {
              id: user._id,
              fullName: user.fullName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              role: user.role,
              isVerified: user.isVerified,
              profile: userProfile
          }
        }
    };
};

// Reusable aggregation pipeline
const getActiveSupervisorsPipeline = (userRefField) => ([
  {
    $lookup: {
      from: "users",
      localField: userRefField,
      foreignField: "_id",
      as: "userData"
    }
  },
  { $unwind: "$userData" },
  {
    $match: {
      "userData.isActive": true,
      "userData.deletedAt": null
    }
  },
  {
    $project: {
      _id: "$userData._id",
      fullName: "$userData.fullName"
    }
  }
]);

export const getCompanySupervisors = async () => {
  return CompSupervisor.aggregate(getActiveSupervisorsPipeline("userId")).exec();
};

export const getUniversitySupervisors = async () => {
  return UniSupervisor.aggregate(getActiveSupervisorsPipeline("userId")).exec();
};