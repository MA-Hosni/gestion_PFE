import mongoose from "mongoose";
import UserStory from "../models/UserStory.model.js";
import Sprint from "../../Team_A/models/sprint.model.js";
import Project from "../../Team_A/models/project.model.js";

import Student from "../../Authentication/models/student.model.js";

// 📌 CREATE USER STORY
// export const createUserStory = async (data) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const {
//       storyName,
//       description = "",
//       priority,
//       storyPointEstimate,
//       startDate,
//       dueDate,
//       sprintId,
//       tasks = []
//     } = data;

//     // Validate dates
//     const start = new Date(startDate);
//     const due = new Date(dueDate);

//     if (due <= start) {
//       const error = new Error("Due date must be after start date");
//       error.status = 400;
//       throw error;
//     }

//     // Validate Sprint exists
//     const sprint = await Sprint.findById(sprintId).session(session);

//     if (!sprint || sprint.deletedAt) {
//       const error = new Error("Sprint not found or deleted");
//       error.status = 404;
//       throw error;
//     }

//     // Validate tasks if provided
//     if (tasks.length > 0) {
//       const taskDocs = await Task.find({ _id: { $in: tasks } }).session(session);

//       if (taskDocs.length !== tasks.length) {
//         const error = new Error("One or more tasks not found");
//         error.status = 404;
//         throw error;
//       }
//     }

//     // Create UserStory
//     const newUserStory = new UserStory({
//       storyName,
//       description,
//       priority,
//       storyPointEstimate,
//       startDate: start,
//       dueDate: due,
//       sprintId,
//       tasks
//     });

//     const savedStory = await newUserStory.save({ session });

//     // Add UserStory to Sprint
//     await Sprint.findByIdAndUpdate(
//       sprintId,
//       { $push: { userStories: savedStory._id } },
//       { session }
//     );

//     // Commit transaction
//     await session.commitTransaction();

//     return {
//       success: true,
//       message: "User story created successfully",
//       data: {
//         userStoryId: savedStory._id,
//         storyName: savedStory.storyName,
//         description: savedStory.description,
//         priority: savedStory.priority,
//         storyPointEstimate: savedStory.storyPointEstimate,
//         startDate: savedStory.startDate,
//         dueDate: savedStory.dueDate,
//         sprintId: savedStory.sprintId,
//         tasks: savedStory.tasks,
//         createdAt: savedStory.createdAt
//       }
//     };

//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// };


// 
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
// Create User Story Correcte : 


// // 📌 GET USER STORY (with Sprint + Tasks populated)
// export const getUserStory = async (projectId) => {
//   const userStory = await UserStory.findOne({
//     _id: userStoryId,
//     deletedAt: null
//   })
//     .populate("sprintId", "title startDate endDate")
//     .populate("tasks", "title status assignedTo");

//   if (!userStory) {
//     const error = new Error("User story not found");
//     error.status = 404;
//     throw error;
//   }

//   return {
//     success: true,
//     data: userStory
//   };
// };


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


// 📌 UPDATE USER STORY
// export const updateUserStory = async (userStoryId, updates) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const userStory = await UserStory.findById(userStoryId).session(session);

//     if (!userStory || userStory.deletedAt) {
//       const error = new Error("User story not found");
//       error.status = 404;
//       throw error;
//     }

//     // Handle sprint change
//     if (updates.sprintId && updates.sprintId !== userStory.sprintId.toString()) {
//       const newSprint = await Sprint.findById(updates.sprintId).session(session);

//       if (!newSprint || newSprint.deletedAt) {
//         const error = new Error("New sprint not found or deleted");
//         error.status = 404;
//         throw error;
//       }

//       // Remove from previous sprint
//       await Sprint.findByIdAndUpdate(
//         userStory.sprintId,
//         { $pull: { userStories: userStoryId } },
//         { session }
//       );

//       // Add to new sprint
//       await Sprint.findByIdAndUpdate(
//         newSprint._id,
//         { $push: { userStories: userStoryId } },
//         { session }
//       );
//     }

//     // Apply updates
//     Object.assign(userStory, updates);
//     await userStory.save({ session });

//     await session.commitTransaction();

//     return {
//       success: true,
//       message: "User story updated successfully",
//       data: userStory
//     };

//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// };



// 📌 SOFT DELETE USER STORY
// export const deleteUserStory = async (userStoryId) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const userStory = await UserStory.findById(userStoryId).session(session);

//     if (!userStory || userStory.deletedAt) {
//       const error = new Error("User story not found");
//       error.status = 404;
//       throw error;
//     }

//     // Soft delete
//     userStory.deletedAt = new Date();
//     await userStory.save({ session });

//     // Remove from Sprint
//     await Sprint.findByIdAndUpdate(
//       userStory.sprintId,
//       { $pull: { userStories: userStoryId } },
//       { session }
//     );

//     await session.commitTransaction();

//     return {
//       success: true,
//       message: "User story deleted successfully"
//     };

//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// };
