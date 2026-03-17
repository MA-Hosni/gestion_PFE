import express from "express";
import { authenticateToken, authorizeStudent, authorizeSupervisor } from "../../../shared/middlewares/auth.middleware.js";
import * as taskController from "../controllers/task.controller.js";
import taskhistory from "./taskHistory.routes.js";
import { validate } from "../../../shared/middlewares/validate.js";
import { TaskSchema } from "../validators/task.validator.js";

const router = express.Router();
// Create a new task

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     description: Student creates a new task inside a user story.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task created successfully
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: User story not found
 *       409:
 *         description: Task with this title already exists for this user story
 */
router.post("/", authenticateToken, authorizeStudent, validate(TaskSchema), taskController.createTask);

// Get a task by ID
/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by its ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get("/:id", authenticateToken, taskController.getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
/*router.patch("/:id", authenticateToken, authorizeStudent, validate(UpdateTaskSchema), taskController.updateTask);*/

// Delete a task by ID
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete("/:id", authenticateToken, authorizeStudent, taskController.deleteTask);


// Get all tasks for a specific company supervisor
/**
 * @swagger
 * /tasks/compsupervisor/{compSupervisorId}:
 *   get:
 *     summary: Get all tasks related to a company supervisor
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: compSupervisorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       404:
 *         description: Supervisor not found
 */
router.get("/compsupervisor/:compSupervisorId", authenticateToken, authorizeSupervisor, taskController.getAllTasksForCompSupervisor);


// Get all tasks for a specific university supervisor
/**
 * @swagger
 * /tasks/univsupervisor/{univSupervisorId}:
 *   get:
 *     summary: Get all tasks related to a university supervisor
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: univSupervisorId
 *         required: true
 *         in: path
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       404:
 *         description: Supervisor not found
 */
router.get("/univsupervisor/:univSupervisorId", authenticateToken, authorizeSupervisor, taskController.getAllTasksForUnivSupervisor);


// Get all tasks for a specific user story
/**
 * @swagger
 * /tasks/userstory/{userStoryId}:
 *   get:
 *     summary: Get all tasks belonging to a specific user story
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userStoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       404:
 *         description: No tasks found
 */
router.get("/userstory/:userStoryId", authenticateToken, authorizeStudent, taskController.getAllTasksForUserStory);


// update task status
/**
 * @swagger
 * /tasks/status/{id}:
 *   patch:
 *     summary: Request a task status change (creates a validation request)
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskStatusRequest'
 *     responses:
 *       200:
 *         description: Status request created
 *       404:
 *         description: Task not found
 */
router.patch("/status/:id", authenticateToken, authorizeStudent, taskController.updateTaskStatus);


// validate task status
/**
 * @swagger
 * /tasks/validate/{id}:
 *   patch:
 *     summary: Supervisor validates a task status update
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         required: true
 *         in: path
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidateStatusRequest'
 *     responses:
 *       200:
 *         description: Task status validated successfully
 *       404:
 *         description: Task validator or task not found
 */
router.patch("/validate/:id", authenticateToken, authorizeSupervisor, taskController.validateTaskStatus);


// get task 
/**
 * @swagger
 * /tasks/history/{task_id}:
 *   get:
 *     summary: Get full history of a task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: task_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TaskHistory'
 */
router.use("/history", taskhistory)

// make full report
/**
 * @swagger
 * /tasks/report/{projectId}:
 *   get:
 *     summary: Generate a full project report
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Full report generated successfully
 *       404:
 *         description: Project not found
 */
router.get("/report/:projectId", authenticateToken, authorizeSupervisor, taskController.makeFullReport)


// get sprint report
/**
 * @swagger
 * /tasks/sprintreport/{sprintId}:
 *   get:
 *     summary: Generate a report for a sprint
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: sprintId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Sprint report generated successfully
 *       404:
 *         description: Sprint not found
 */
router.get("/sprintreport/:sprintId", authenticateToken, authorizeSupervisor, taskController.getSprintReport)
export default router;
