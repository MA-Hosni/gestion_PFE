import express from "express";
import { authenticateToken, authorizeStudent, authorizeSupervisor } from "../../../shared/middlewares/auth.middleware.js";
import * as taskController from "../controllers/task.controller.js";
import taskhistory from "./taskHistory.routes.js";
import { validate } from "../../../shared/middlewares/validate.js";
import { TaskSchema, UpdateTaskSchema } from "../validators/task.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - status
 *         - userStoryId
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [ToDo, InProgress, Standby, Done]
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *         userStoryId:
 *           type: string
 *         assignedTo:
 *           type: string
 *     UpdateTask:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [ToDo, InProgress, Standby, Done]
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *         userStoryId:
 *           type: string
 *         assignedTo:
 *           type: string
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/", authenticateToken, authorizeStudent, validate(TaskSchema), taskController.createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", authenticateToken, taskController.getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTask'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
/*router.patch("/:id", authenticateToken, authorizeStudent, validate(UpdateTaskSchema), taskController.updateTask);*/

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", authenticateToken, authorizeStudent, taskController.deleteTask);

/**
 * @swagger
 * /tasks/compsupervisor/{compSupervisorId}:
 *   get:
 *     summary: Get all tasks for a specific company supervisor
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
 *         description: List of tasks
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/compsupervisor/:compSupervisorId", authenticateToken, authorizeSupervisor, taskController.getAllTasksForCompSupervisor);

/**
 * @swagger
 * /tasks/univsupervisor/{univSupervisorId}:
 *   get:
 *     summary: Get all tasks for a specific university supervisor
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: univSupervisorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/univsupervisor/:univSupervisorId", authenticateToken, authorizeSupervisor, taskController.getAllTasksForUnivSupervisor);

/**
 * @swagger
 * /tasks/userstory/{userStoryId}:
 *   get:
 *     summary: Get all tasks for a specific user story
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userStoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/userstory/:userStoryId", authenticateToken, authorizeStudent, taskController.getAllTasksForUserStory);

/**
 * @swagger
 * /tasks/status/{id}:
 *   patch:
 *     summary: Update task status
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ToDo, InProgress, Standby, Done]
 *     responses:
 *       200:
 *         description: Task status updated
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.patch("/status/:id", authenticateToken, authorizeStudent, taskController.updateTaskStatus);

/**
 * @swagger
 * /tasks/validate/{id}:
 *   patch:
 *     summary: Validate task status
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task validated
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.patch("/validate/:id", authenticateToken, authorizeSupervisor, taskController.validateTaskStatus);

// get task history
router.use("/history", taskhistory)

/**
 * @swagger
 * /tasks/report/{projectId}:
 *   get:
 *     summary: Make full report
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Full report
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/report/:projectId", authenticateToken, authorizeSupervisor, taskController.makeFullReport)

/**
 * @swagger
 * /tasks/sprintreport/{sprintId}:
 *   get:
 *     summary: Get sprint report
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sprintId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sprint report
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/sprintreport/:sprintId", authenticateToken, authorizeSupervisor, taskController.getSprintReport)
export default router;
