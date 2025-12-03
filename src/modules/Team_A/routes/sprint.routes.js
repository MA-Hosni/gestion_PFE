import express from "express";
import { authenticateToken, authorizeStudent } from "../../../shared/middlewares/auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.js";
import {
  SprintSchema,
  updateSprintSchema,
  reorderSprintsSchema
} from "../validators/sprint.validator.js";
import * as sprintController from "../controllers/sprint.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sprints
 *   description: Sprint management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Sprint:
 *       type: object
 *       required:
 *         - title
 *         - goal
 *         - startDate
 *         - endDate
 *       properties:
 *         title:
 *           type: string
 *           description: Sprint title
 *         goal:
 *           type: string
 *           description: Sprint goal
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Sprint start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Sprint end date
 *     UpdateSprint:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         goal:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *     ReorderSprints:
 *       type: object
 *       required:
 *         - sprints
 *       properties:
 *         sprints:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - sprintId
 *               - orderIndex
 *             properties:
 *               sprintId:
 *                 type: string
 *               orderIndex:
 *                 type: integer
 */

/**
 * @swagger
 * /sprints:
 *   post:
 *     summary: Create a new sprint
 *     tags: [Sprints]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sprint'
 *     responses:
 *       201:
 *         description: Sprint created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/", authenticateToken, authorizeStudent, validate(SprintSchema), sprintController.createSprint);

/**
 * @swagger
 * /sprints/reorder:
 *   patch:
 *     summary: Reorder sprints
 *     tags: [Sprints]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReorderSprints'
 *     responses:
 *       200:
 *         description: Sprints reordered successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.patch("/reorder", authenticateToken, authorizeStudent, validate(reorderSprintsSchema), sprintController.reorderSprints);

/**
 * @swagger
 * /sprints/{sprintId}:
 *   patch:
 *     summary: Update a sprint
 *     tags: [Sprints]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sprintId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSprint'
 *     responses:
 *       200:
 *         description: Sprint updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch("/:sprintId", authenticateToken, authorizeStudent, validate(updateSprintSchema), sprintController.updateSprint);

/**
 * @swagger
 * /sprints/{sprintId}:
 *   delete:
 *     summary: Delete a sprint
 *     tags: [Sprints]
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
 *         description: Sprint deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:sprintId", authenticateToken, authorizeStudent, sprintController.deleteSprint);

export default router;