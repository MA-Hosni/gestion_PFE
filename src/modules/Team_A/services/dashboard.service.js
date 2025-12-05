import mongoose from 'mongoose';
import Project from '../models/project.model.js';
import Meeting from "../../Team_D/models/meeting.model.js";
import Validation from "../../Team_D/models/validation.model.js";
import Report from "../../Team_B/models/report.model.js";
import TaskHistory from "../../Team_C/models/taskHistory.model.js";
import Task from "../../Team_C/models/task.model.js";
import UserStory from "../../Team_B/models/UserStory.model.js";
import Sprint from "../models/sprint.model.js";
import Student from "../../Authentication/models/student.model.js";

const computePercentage = (done, total) => total ? Number(((done / total) * 100).toFixed(1)) : 0;

const getMonthDateRange = (month, year) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    return { start, end };
};

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

const fetchProjectEvents = async (projectIds, start, end) => {
    // 1. Fetch Meetings
    const meetingsPromise = Meeting.find({
        projectId: { $in: projectIds },
        scheduledDate: { $gte: start, $lte: end },
        deletedAt: null
    }).populate('projectId', 'title').lean();

    // 2. Fetch Reports
    const reportsPromise = Report.find({
        projectId: { $in: projectIds },
        createdAt: { $gte: start, $lte: end },
        deletedAt: null
    }).populate('projectId', 'title').lean();

    // 3. Fetch Tasks related events (Status Changes & Validations)
    // First, find all tasks associated with these projects
    // Project -> Sprint -> UserStory -> Task
    
    // Fetch Projects to get titles map
    const projects = await Project.find({ _id: { $in: projectIds } }).select('title').lean();
    const projectTitleMap = projects.reduce((acc, p) => {
        acc[p._id.toString()] = p.title;
        return acc;
    }, {});

    const sprints = await Sprint.find({
        projectId: { $in: projectIds },
        deletedAt: null
    }).select('_id projectId').lean();
    
    const sprintMap = sprints.reduce((acc, s) => {
        acc[s._id.toString()] = s.projectId;
        return acc;
    }, {});
    const sprintIds = sprints.map(s => s._id);

    const userStories = await UserStory.find({
        sprintId: { $in: sprintIds },
        deletedAt: null
    }).select('_id sprintId').lean();

    const userStoryMap = userStories.reduce((acc, us) => {
        acc[us._id.toString()] = us.sprintId;
        return acc;
    }, {});
    const userStoryIds = userStories.map(us => us._id);

    const tasks = await Task.find({
        userStoryId: { $in: userStoryIds }
    }).select('_id title userStoryId').lean();

    const taskIds = tasks.map(t => t._id);
    const taskMap = tasks.reduce((acc, task) => {
        acc[task._id.toString()] = {
            title: task.title,
            userStoryId: task.userStoryId
        };
        return acc;
    }, {});

    // Helper to get project info from taskId
    const getProjectInfoForTask = (taskId) => {
        const task = taskMap[taskId.toString()];
        if (!task) return { id: null, title: 'Unknown' };
        
        const sprintId = userStoryMap[task.userStoryId.toString()];
        if (!sprintId) return { id: null, title: 'Unknown' };

        const projectId = sprintMap[sprintId.toString()];
        if (!projectId) return { id: null, title: 'Unknown' };

        return {
            id: projectId,
            title: projectTitleMap[projectId.toString()] || 'Unknown'
        };
    };

    // Now fetch TaskHistory and Validations
    const taskHistoryPromise = TaskHistory.find({
        taskId: { $in: taskIds },
        fieldChanged: 'status',
        modifiedAt: { $gte: start, $lte: end }
    }).populate('modifiedBy', 'fullName').lean();

    const validationsPromise = Validation.find({
        taskId: { $in: taskIds },
        createdAt: { $gte: start, $lte: end },
        deletedAt: null
    }).populate('validatorId', 'userId').lean(); 

    const [meetings, reports, taskHistories, validations] = await Promise.all([
        meetingsPromise,
        reportsPromise,
        taskHistoryPromise,
        validationsPromise
    ]);

    // Normalize events
    const events = [];

    meetings.forEach(m => {
        events.push({
            type: 'meeting',
            date: m.scheduledDate,
            title: `Meeting: ${m.agenda || 'No Agenda'}`,
            description: `Scheduled meeting for project ${m.projectId?.title || 'Unknown'}`,
            projectId: m.projectId?._id,
            projectName: m.projectId?.title,
            metadata: m
        });
    });

    reports.forEach(r => {
        events.push({
            type: 'report',
            date: r.createdAt,
            title: `Report Uploaded: Version ${r.versionLabel}`,
            description: `Report uploaded for project ${r.projectId?.title || 'Unknown'}`,
            projectId: r.projectId?._id,
            projectName: r.projectId?.title,
            metadata: r
        });
    });

    taskHistories.forEach(th => {
        const projectInfo = getProjectInfoForTask(th.taskId);
        events.push({
            type: 'status_change',
            date: th.modifiedAt,
            title: `Task Status Changed: ${taskMap[th.taskId.toString()]?.title || 'Unknown Task'}`,
            description: `Status changed from ${th.oldValue?.status || 'Unknown'} to ${th.newValue?.status || 'Unknown'} by ${th.modifiedBy?.fullName || 'Unknown'}`,
            projectId: projectInfo.id,
            projectName: projectInfo.title,
            metadata: th
        });
    });

    validations.forEach(v => {
        const projectInfo = getProjectInfoForTask(v.taskId);
        events.push({
            type: 'validation',
            date: v.createdAt,
            title: `Validation: ${v.status}`,
            description: `Task validation ${v.status} for task ${taskMap[v.taskId.toString()]?.title || 'Unknown Task'}`,
            projectId: projectInfo.id,
            projectName: projectInfo.title,
            metadata: v
        });
    });

    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const getStudentTimeline = async (studentId, projectId, month, year) => {
    if (!projectId) {
        return [];
    }

    const { start, end } = getMonthDateRange(month, year);
    return await fetchProjectEvents([projectId], start, end);
};

export const getSupervisorTimeline = async (supervisorId, studentsId, month, year) => {
    if (!studentsId || studentsId.length === 0) {
        return [];
    }

    // Get all projects for these students
    const students = await Student.find({
        _id: { $in: studentsId },
        project: { $ne: null } // Only students with projects
    }).select('project').lean();

    const projectIds = [...new Set(students.map(s => s.project))];

    if (projectIds.length === 0) {
        return [];
    }

    const { start, end } = getMonthDateRange(month, year);
    return await fetchProjectEvents(projectIds, start, end);
};

export const getStandbyTasks = async (projectId) => {
    if (!projectId) return [];

    // 1. Find Sprints in Project
    const sprints = await Sprint.find({ projectId, deletedAt: null }).select('_id').lean();
    const sprintIds = sprints.map(s => s._id);

    // 2. Find UserStories in Sprints
    const userStories = await UserStory.find({ sprintId: { $in: sprintIds }, deletedAt: null }).select('_id').lean();
    const userStoryIds = userStories.map(us => us._id);

    // 3. Find Tasks in UserStories where status is "Standby"
    const tasks = await Task.find({
        userStoryId: { $in: userStoryIds },
        status: 'Standby'
    }).populate({
        path: 'userStoryId',
        select: 'storyName priority'
    }).lean();

    return tasks;
};

export const getPendingValidations = async (projectId) => {
    if (!projectId) return [];

    // 1. Find Sprints -> UserStories -> Tasks (status='Done')
    const sprints = await Sprint.find({ projectId, deletedAt: null }).select('_id').lean();
    const sprintIds = sprints.map(s => s._id);

    const userStories = await UserStory.find({ sprintId: { $in: sprintIds }, deletedAt: null }).select('_id').lean();
    const userStoryIds = userStories.map(us => us._id);

    const doneTasks = await Task.find({
        userStoryId: { $in: userStoryIds },
        status: 'Done'
    }).populate({
        path: 'userStoryId',
        select: 'storyName'
    }).lean();

    const pendingTasks = [];

    // 2. Check validations for each task
    for (const task of doneTasks) {
        const validations = await Validation.find({ taskId: task._id, deletedAt: null })
            .sort({ createdAt: -1 })
            .limit(1)
            .lean();

        // Condition: No validation exists OR Last validation status is 'invalid'
        if (validations.length === 0 || validations[0].status === 'invalid') {
            pendingTasks.push({
                ...task,
                lastValidation: validations.length > 0 ? validations[0] : null
            });
        }
    }

    return pendingTasks;
};

export const getLatestMeetings = async (projectId) => {
    if (!projectId) return [];

    return await Meeting.find({ projectId, deletedAt: null })
        .sort({ scheduledDate: -1 })
        .limit(5)
        .lean();
};