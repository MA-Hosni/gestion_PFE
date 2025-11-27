import mongoose from "mongoose";
import UserStory from "../models/UserStory.model.js";
import Sprint from "../../Team_A/models/sprint.model.js";
import Project from "../../Team_A/models/project.model.js";

import Student from "../../Authentication/models/student.model.js";

// 📌 CREATE USER STORY

export const createUserStory = async (data , studentId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {storyName,description ,priority,storyPointEstimate,startDate,dueDate,sprintId} = data;

    /** ----------------------------------------------------
     * 1. Validate that the student has a project
     * ---------------------------------------------------- */
    const student = await Student.findById(studentId).session(session);
        
    if (!student) {
          const error = new Error("Student not found");
          error.status = 404;
          throw error;
        }
 

    if (!student.project) {
      const error = new Error("Student has no assigned project");
      error.status = 400;
      throw error;
    }

    /** ---------------------------------------------
     * 2. Validate that sprint exists AND belongs to project
     * --------------------------------------------- */
    const sprint = await Sprint.findById(sprintId).session(session);

    if (!sprint || sprint.deletedAt) {
      const error = new Error("Sprint not found or deleted");
      error.status = 404;
      throw error;
    }

    // Check sprint belongs to student's project
    if (String(sprint.projectId) !== String(student.project)) {
      const error = new Error("Sprint does not belong to your project");
      error.status = 403;
      throw error;
    }

    /** --------------------
     * 3. Validate dates
     * -------------------- */
    const start = new Date(startDate);
    const due = new Date(dueDate);

    if (due <= start) {
      const error = new Error("Due date must be after start date");
      error.status = 400;
      throw error;
    }


    /** ----------------------------
     * 5. Create User Story
     * ---------------------------- */
    const newUserStory = new UserStory({
      storyName,
      description,
      priority,
      storyPointEstimate,
      startDate: start,
      dueDate: due,
      sprintId
    });

    const savedStory = await newUserStory.save({ session });

    /** --------------------------------------------
     * 6. Add UserStory reference to sprint
     * -------------------------------------------- */
    await Sprint.findByIdAndUpdate(
      sprintId,
      { $push: { userStories: savedStory._id } },
      { session }
    );

    await session.commitTransaction();

    return {
      success: true,
      message: "User story created successfully",
      data: {
        userStoryId: savedStory._id,
        storyName: savedStory.storyName,
        description: savedStory.description,
        priority: savedStory.priority,
        storyPointEstimate: savedStory.storyPointEstimate,
        startDate: savedStory.startDate,
        dueDate: savedStory.dueDate,
        sprintId: savedStory.sprintId,
        createdAt: savedStory.createdAt
      }
    };

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// get User Stories for student's project
export const getUserStories = async (projectId) => {
  try {

    if (!projectId) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "No project assigned to your account"
          });
        }
        
    // 1️⃣ Vérifier que le projet existe
    const project = await Project.findOne({ _id: projectId, deletedAt: null }).populate({
      path: 'sprints',
      match: { deletedAt: null }, // ignorer les sprints supprimés
      select: '_id title orderIndex'
    });

    if (!project) {
      return {
        success: false,
        message: "Project not found",
        data: []
      };
    }

    // 2️⃣ Récupérer tous les sprints du projet
    const sprintIds = project.sprints.map(s => s._id);

    if (sprintIds.length === 0) {
      return {
        success: true,
        message: "No sprints found for this project",
        data: []
      };
    }

    // 3️⃣ Récupérer toutes les UserStories liées à ces sprints
    const userStories = await UserStory.find({
      sprintId: { $in: sprintIds },
      deletedAt: null
    })
    .populate({
      path: 'sprintId',
      select: 'title'
    })
    .sort({ startDate: 1 }); // optionnel : trier par date de début

    return {
      success: true,
      message: "User stories retrieved successfully",
      data: userStories
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: []
    };
  }
};

// get User Stories related to sprint
export const getUserStoriesRelatedToSprint = async (projectId, sprintId) => {
  try {

    /** 1️⃣ Vérifier que l'étudiant a un projet */
    if (!projectId) {
      const error = new Error("No project assigned to your account");
      error.status = 404;
      throw error;
    }

    /** 2️⃣ Vérifier que le sprint existe */
    const sprint = await Sprint.findById(sprintId);

    if (!sprint || sprint.deletedAt) {
      const error = new Error("Sprint not found or deleted");
      error.status = 404;
      throw error;
    }

    /** 3️⃣ Vérifier que le sprint appartient bien au projet */
    if (String(sprint.projectId) !== String(projectId)) {
      const error = new Error("Sprint does not belong to your project");
      error.status = 403;
      throw error;
    }

    /** 4️⃣ Récupérer user stories avec deletedAt = null */
    const userStories = await UserStory.find({
      sprintId: sprintId,
      deletedAt: null
    })
      .select([
        "storyName",
        "description",
        "priority",
        "storyPointEstimate",
        "startDate",
        "dueDate",
        "tasks"
      ])
      .sort({ createdAt: 1 })
      .lean();

    return {
      success: true,
      message: "User stories retrieved successfully", 
      data: {
        sprint: {
          _id: sprintId,
          title: sprint.title,
          goal: sprint.goal,
          startDate: sprint.startDate,
          endDate: sprint.endDate
        },
        userStories
      }
    };

  } catch (error) {
    throw error;
  }
};

// get US by ID
export const getUserStoryByID = async (projectId, userStoryId) => {
  try {
    /** 1️⃣ Vérifier que l'étudiant a un projet */
    if (!projectId) {
      const error = new Error("1️⃣ No project assigned to your account");
      error.status = 404;
      throw error;
    }

    /** 2️⃣ Vérifier que la user story existe */
    const userStory = await UserStory.findById(userStoryId).lean();
    if (!userStory || userStory.deletedAt) {
      const error = new Error(" 2️⃣  User Story not found or deleted");
      error.status = 404;
      throw error;
    }

    /** 3️⃣ Vérifier que le sprint auquel elle appartient existe */
    const sprint = await Sprint.findById(userStory.sprintId ).lean();
    if (!sprint || sprint.deletedAt) {
      const error = new Error("3️⃣ Sprint not found or deleted");
      error.status = 404;
      throw error;
    }

    /** 4️⃣ Vérifier que le sprint appartient bien au projet de l'étudiant */
    if (String(sprint.projectId) !== String(projectId)) {
      const error = new Error(" 4️⃣ Sprint does not belong to your project");
      error.status = 403;
      throw error;
    }

    /** 5️⃣ Tout est ok, retourner la user story avec les infos du sprint */
    return {
      success: true,
      message: "User Story retrieved successfully",
      data: userStory
    };

  } catch (error) {
    throw error; // Le controller gérera l'erreur
  }
};

// 🚀 UPDATE USER STORY 


export const updateUserStory = async (userStoryId , updateData , projectId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  // al yardemek : update sprint 
  
};

