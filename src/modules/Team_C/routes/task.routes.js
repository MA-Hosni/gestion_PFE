import express from "express";
import { authenticateToken, authorizeStudent, authorizeSupervisor } from "../../../shared/middlewares/auth.middleware.js";
import * as taskController from "../controllers/task.controller.js";
import taskhistory from "./taskHistory.routes.js";
import { validate } from "../../../shared/middlewares/validate.js";
import { TaskSchema, UpdateTaskSchema } from "../validators/task.validator.js";

const router = express.Router();
// Create a new task
router.post("/", authenticateToken, authorizeStudent, validate(TaskSchema), taskController.createTask);
// Get a task by ID
router.get("/:id", authenticateToken, authorizeStudent, authorizeSupervisor, taskController.getTaskById);
// Update a task by ID
router.patch("/:id", authenticateToken, authorizeStudent, validate(UpdateTaskSchema), taskController.updateTask);
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
// validate task status
router.patch("/validate/:id", authenticateToken, authorizeSupervisor, taskController.validateTaskStatus);
// get task history
router.use("/history", taskhistory)
// make full report
router.get("/report/:projectId", authenticateToken, authorizeSupervisor, taskController.makeFullReport)
// get sprint report
router.get("/sprintreport/:sprintId", authenticateToken, authorizeSupervisor, taskController.getSprintReport)
export default router;
