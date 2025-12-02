import mongoose from 'mongoose';
import Project from '../models/project.model.js';
// import UserStory from '../../Team_B/models/UserStory.model.js';
// import Task from '../../Team_C/models/task.model.js';
// import TaskHistory from '../../Team_C/models/taskHistory.model.js';
// import Meeting from '../../Team_D/models/meeting.model.js';
// import Validation from '../../Team_D/models/validation.model.js';

const computePercentage = (done, total) => total
  ? Number(((done / total) * 100).toFixed(1))
  : 0;


export const getAllProjects = async (studentIds) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

export const getProgress = async (projectId) => {
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    const error = new Error("Invalid project identifier");
    error.status = 400;
    throw error;
  }

  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  const [project] = await Project.aggregate([
    {
      $match: {
        _id: projectObjectId,
        deletedAt: null
      }
    },
    {
      $lookup: {
        from: 'sprints',
        let: { projectId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$projectId', '$$projectId'] },
                  { $eq: ['$deletedAt', null] }
                ]
              }
            }
          },
          { $sort: { orderIndex: 1, startDate: 1 } },
          {
            $lookup: {
              from: 'userstories',
              let: { sprintId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$sprintId', '$$sprintId'] },
                        { $eq: ['$deletedAt', null] }
                      ]
                    }
                  }
                },
                {
                  $lookup: {
                    from: 'tasks',
                    let: { userStoryId: '$_id' },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ['$userStoryId', '$$userStoryId'] }
                        }
                      },
                      {
                        $group: {
                          _id: null,
                          totalTasks: { $sum: 1 },
                          doneTasks: {
                            $sum: {
                              $cond: [{ $eq: ['$status', 'Done'] }, 1, 0]
                            }
                          }
                        }
                      }
                    ],
                    as: 'taskStats'
                  }
                },
                {
                  $addFields: {
                    stats: {
                      $ifNull: [
                        { $arrayElemAt: ['$taskStats', 0] },
                        { totalTasks: 0, doneTasks: 0 }
                      ]
                    }
                  }
                },
                {
                  $project: {
                    _id: 1,
                    storyName: 1,
                    totalTasks: '$stats.totalTasks',
                    doneTasks: '$stats.doneTasks'
                  }
                }
              ],
              as: 'userStories'
            }
          },
          {
            $project: {
              _id: 1,
              title: 1,
              orderIndex: 1,
              startDate: 1,
              endDate: 1,
              userStories: 1
            }
          }
        ],
        as: 'sprints'
      }
    },
    {
      $project: {
        _id: 1,
        sprints: 1
      }
    }
  ]);

  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  const sprints = (project.sprints || []).map((sprint) => {
    const userStories = (sprint.userStories || []).map((story) => {
      const totalTasks = story.totalTasks || 0;
      const doneTasks = story.doneTasks || 0;

      return {
        _id: story._id,
        storyName: story.storyName,
        totalTasks,
        doneTasks,
        progress: computePercentage(doneTasks, totalTasks)
      };
    });

    const sprintTotals = userStories.reduce((acc, story) => {
      acc.totalTasks += story.totalTasks;
      acc.doneTasks += story.doneTasks;
      return acc;
    }, { totalTasks: 0, doneTasks: 0 });

    return {
      _id: sprint._id,
      title: sprint.title,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      totalTasks: sprintTotals.totalTasks,
      doneTasks: sprintTotals.doneTasks,
      progress: computePercentage(sprintTotals.doneTasks, sprintTotals.totalTasks),
      userStories
    };
  });

  const projectTotals = sprints.reduce((acc, sprint) => {
    acc.totalTasks += sprint.totalTasks;
    acc.doneTasks += sprint.doneTasks;
    return acc;
  }, { totalTasks: 0, doneTasks: 0 });

  return {
    success: true,
    message: 'Project progress retrieved successfully',
    data: {
      projectProgress: {
        totalTasks: projectTotals.totalTasks,
        doneTasks: projectTotals.doneTasks,
        progress: computePercentage(projectTotals.doneTasks, projectTotals.totalTasks)
      },
      sprints
    }
  };
};