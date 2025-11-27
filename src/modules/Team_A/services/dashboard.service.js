import mongoose from 'mongoose';
import Project from '../models/project.model.js';
import Sprint from '../models/sprint.model.js';
import UserStory from '../../Team_B/models/UserStory.model.js';
import Task from '../../Team_C/models/task.model.js';
import TaskHistory from '../../Team_C/models/taskHistory.model.js';
import Meeting from '../../Team_D/models/meeting.model.js';
import Validation from '../../Team_D/models/validation.model.js';


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

export const getTimeline = async (projectId) => {
    // 1. Get Project to find contributors/students
    const project = await Project.findById(projectId).populate('contributors');
    if (!project) throw new Error('Project not found');

    const studentIds = project.contributors.map(s => s._id);

    // 2. Fetch Events
    
    // Meetings
    const meetings = await Meeting.find({
        $or: [
            { createdBy: { $in: studentIds } },
            // Assuming meetings can be linked to project via reference or context, 
            // but for now we filter by creators who are contributors
        ],
        deletedAt: null
    }).lean();

    // Validations
    const validations = await Validation.find({
        validatorId: { $in: studentIds }, // Or validated by supervisors? Logic might need adjustment based on roles
        deletedAt: null
    }).populate('taskId').lean();

    // Task Status Changes (from TaskHistory)
    // First find tasks related to this project
    const sprints = await Sprint.find({ projectId, deletedAt: null }).select('_id');
    const sprintIds = sprints.map(s => s._id);
    
    // Find UserStories in these sprints
    const userStories = await UserStory.find({ 
        // Logic to link US to Sprint is via Sprint.userStories array
        _id: { $in: (await Sprint.find({ projectId }).distinct('userStories')) }
    }).select('_id');
    const usIds = userStories.map(us => us._id);

    // Find Tasks in these UserStories
    const tasks = await Task.find({ userStoryId: { $in: usIds } }).select('_id title');
    const taskIds = tasks.map(t => t._id);

    const taskHistories = await TaskHistory.find({
        taskId: { $in: taskIds },
        fieldChanged: 'status'
    }).populate('taskId', 'title').lean();


    // 3. Normalize and Merge
    const timeline = [];

    meetings.forEach(m => {
        timeline.push({
            type: 'MEETING',
            date: m.scheduledDate,
            title: 'Réunion',
            description: m.agenda,
            details: { status: m.validationStatus, reference: m.referenceType }
        });
    });

    validations.forEach(v => {
        timeline.push({
            type: 'VALIDATION',
            date: v.createdAt,
            title: 'Validation',
            description: v.comment || `Validation for task ${v.taskId?.title}`,
            details: { status: v.status, type: v.meetingType }
        });
    });

    taskHistories.forEach(th => {
        timeline.push({
            type: 'STATUS_CHANGE',
            date: th.modifiedAt,
            title: 'Changement de statut',
            description: `Task "${th.taskId?.title}" changed from ${th.oldValue?.status || 'Unknown'} to ${th.newValue?.status}`,
            details: { task: th.taskId?.title, from: th.oldValue?.status, to: th.newValue?.status }
        });
    });

    // Sort by date descending
    return timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getStats = async (projectId) => {
    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');

    // Sprints & User Stories
    const sprints = await Sprint.find({ projectId, deletedAt: null }).populate('userStories');
    
    let totalTasks = 0;
    let doneTasks = 0;
    let standbyTasks = 0;
    
    // We need to fetch tasks for all user stories
    const allUserStories = sprints.flatMap(s => s.userStories || []);
    const usIds = allUserStories.map(us => us._id);
    
    const tasks = await Task.find({ userStoryId: { $in: usIds } });

    totalTasks = tasks.length;
    doneTasks = tasks.filter(t => t.status === 'Done').length;
    standbyTasks = tasks.filter(t => t.status === 'Standby').length;

    const globalProgress = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

    // Validations en attente (Pending)
    // Find validations linked to these tasks
    const pendingValidationsCount = await Validation.countDocuments({
        taskId: { $in: tasks.map(t => t._id) },
        status: { $ne: 'valid' } // Assuming 'valid' is the final state, anything else might be pending/invalid
        // Note: Validation model has 'valid', 'invalid'. 'pending' is on Meeting model.
        // Let's check Meeting pending status for 'validation' reference type?
        // Or simply count tasks that are 'Done' but not yet validated if that flow exists.
        // Based on cahier de charge: "validations en attente"
        // Let's assume this refers to Meetings with validationStatus 'pending'
    });
    
    // Better approach for "validations en attente":
    // Meetings that are for validation and are pending
    const pendingMeetings = await Meeting.countDocuments({
        referenceType: { $in: ['user_story', 'task', 'report'] }, // Assuming these need validation
        validationStatus: 'pending',
        deletedAt: null
    });


    // Dernières réunions et dépôts
    const lastMeeting = await Meeting.findOne({
        // Filter by project context if possible, for now global to contributors
        deletedAt: null
    }).sort({ scheduledDate: -1 });

    // Dépôts (Reports) - Placeholder as Report model is missing
    // We will simulate this with a Meeting of type 'report'
    const lastDepot = await Meeting.findOne({
        referenceType: 'report',
        deletedAt: null
    }).sort({ scheduledDate: -1 });


    return {
        globalProgress: Math.round(globalProgress),
        stats: {
            totalTasks,
            doneTasks,
            standbyTasks,
            pendingValidations: pendingMeetings // Using pending meetings as proxy
        },
        latest: {
            meeting: lastMeeting,
            depot: lastDepot
        }
    };
};
