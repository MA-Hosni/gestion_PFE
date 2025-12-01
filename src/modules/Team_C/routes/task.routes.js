import express from "express";
import { authenticateToken, authorizeStudent, authorizeSupervisor } from "../../../shared/middlewares/auth.middleware.js";
import * as taskController from "../controllers/task.controller.js";

const router = express.Router();
// Create a new task
router.post("/", authenticateToken, authorizeStudent, taskController.createTask);
// Get all tasks
router.get("/", authenticateToken, authorizeStudent, taskController.getAllTasks);
// Get a task by ID
router.get("/:id", authenticateToken, authorizeStudent, authorizeSupervisor, taskController.getTaskById);
// Update a task by ID
router.patch("/:id", authenticateToken, authorizeStudent, taskController.updateTask);
// Delete a task by ID
router.delete("/:id", authenticateToken, authorizeStudent, taskController.deleteTask);
// Get all tasks for a specific company supervisor
router.get("/supervisor/:compSupervisorId", authenticateToken, authorizeSupervisor, taskController.getAllTasksForCompSupervisor);

export default router;
