import express from "express";
import { authenticateToken, authorizeStudent, authorizeSupervisor } from "../../../shared/middlewares/auth.middleware.js";
import * as taskController from "../controllers/task.controller.js";

const router = express.Router();
// Create a new task
router.post("/", authenticateToken, authorizeStudent, taskController.createTask);
// Get a task by ID
router.get("/:id", authenticateToken, authorizeStudent, authorizeSupervisor, taskController.getTaskById);
// Update a task by ID
router.patch("/:id", authenticateToken, authorizeStudent, taskController.updateTask);
// Delete a task by ID
router.delete("/:id", authenticateToken, authorizeStudent, taskController.deleteTask);
// Get all tasks for a specific company supervisor
router.get("/compsupervisor/:compSupervisorId", authenticateToken, authorizeSupervisor, taskController.getAllTasksForCompSupervisor);
// Get all tasks for a specific university supervisor
router.get("/univsupervisor/:univSupervisorId", authenticateToken, authorizeSupervisor, taskController.getAllTasksForUnivSupervisor);
// Get all tasks for a specific user story
router.get("/userstory/:userStoryId", authenticateToken, authorizeStudent, taskController.getAllTasksForUserStory);
// update task status
router.patch("/status/:id", authenticateToken, authorizeStudent, taskController.updateTaskStatus);
export default router;
  