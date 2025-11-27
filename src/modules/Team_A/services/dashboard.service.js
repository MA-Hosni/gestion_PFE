import Project from '../models/project.model.js';

export const getAllProjects = async (studentIds) => {
  // Early return if no students
  if (!studentIds || studentIds.length === 0) {
    return {
      success: true,
      message: "No students assigned to this supervisor",
      data: []
    };
  }

  // Get all unique projects where any of the supervisor's students are contributors
  const projects = await Project.aggregate([
    {
      $match: {
        contributors: { $in: studentIds },
        deletedAt: null
      }
    },
    {
      $lookup: {
        from: "students",
        localField: "contributors",
        foreignField: "_id",
        as: "contributorDetails"
      }
    },
    {
      $unwind: "$contributorDetails"
    },
    {
      $lookup: {
        from: "users",
        localField: "contributorDetails.userId",
        foreignField: "_id",
        as: "contributorDetails.user"
      }
    },
    {
      $unwind: "$contributorDetails.user"
    },
    {
      $match: {
        "contributorDetails.user.isActive": true,
        "contributorDetails.user.deletedAt": null
      }
    },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        description: { $first: "$description" },
        startDate: { $first: "$startDate" },
        endDate: { $first: "$endDate" },
        contributors: {
          $push: {
            _id: "$contributorDetails._id",
            fullName: "$contributorDetails.user.fullName",
            email: "$contributorDetails.user.email"
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        startDate: 1,
        endDate: 1,
        contributors: 1
      }
    },
    {
      $sort: { startDate: -1 }
    }
  ]);

  return {
    success: true,
    message: "Projects retrieved successfully",
    data: projects
  };
};