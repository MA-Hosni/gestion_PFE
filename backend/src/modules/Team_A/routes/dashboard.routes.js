import express from "express";
import { authenticateToken, authorizeStudent, authorizeSupervisor } from "../../../shared/middlewares/auth.middleware.js";
import * as dashboardController from '../controllers/dashboard.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard analytics and summaries
 */

/**
 * @swagger
 * /dashboard/projects:
 *   get:
 *     summary: Get all projects (Supervisor)
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all projects
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/projects", authenticateToken, authorizeSupervisor, dashboardController.getAllProjects);

/**
 * @swagger
 * /dashboard/{projectId}:
 *   get:
 *     summary: Get project progress
 *     tags: [Dashboard]
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
 *         description: Project progress details
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/:projectId", authenticateToken, dashboardController.getProgress);

/**
 * @swagger
 * /dashboard/student/timeline:
 *   get:
 *     summary: Get student timeline
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Student timeline events
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/student/timeline", authenticateToken, authorizeStudent, dashboardController.getStudentTimeline);

/**
 * @swagger
 * /dashboard/student/tasks/standby:
 *   get:
 *     summary: Get student standby tasks
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of standby tasks
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/student/tasks/standby", authenticateToken, authorizeStudent, dashboardController.getStudentStandbyTasks);

/**
 * @swagger
 * /dashboard/supervisor/timeline:
 *   get:
 *     summary: Get supervisor timeline
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Supervisor timeline events
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/supervisor/timeline", authenticateToken, authorizeSupervisor, dashboardController.getSupervisorTimeline);

/**
 * @swagger
 * /dashboard/supervisor/validations/{projectId}:
 *   get:
 *     summary: Get pending validations for a project
 *     tags: [Dashboard]
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
 *         description: List of pending validations
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/supervisor/validations/:projectId", authenticateToken, authorizeSupervisor, dashboardController.getSupervisorPendingValidations);

/**
 * @swagger
 * /dashboard/supervisor/meetings/{projectId}:
 *   get:
 *     summary: Get latest meetings for a project
 *     tags: [Dashboard]
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
 *         description: List of latest meetings
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/supervisor/meetings/:projectId", authenticateToken, authorizeSupervisor, dashboardController.getSupervisorLatestMeetings);

export default router;