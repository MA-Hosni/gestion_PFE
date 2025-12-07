// src/modules/Team_D/routes/validation.routes.js
import express from "express";
import {
  authenticateToken,
  authorizeSupervisor
} from "../../../shared/middlewares/auth.middleware.js";
import * as validationController from "../controllers/validation.controller.js";
import { validate } from "../../../shared/middlewares/validate.js";
import { ValidationSchema } from "../validators/validation.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Validations
 *   description: Validation management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Validation:
 *       type: object
 *       required:
 *         - taskId
 *         - status
 *         - meetingType
 *       properties:
 *         taskId:
 *           type: string
 *         status:
 *           type: string
 *           enum: [valid, invalid]
 *         meetingType:
 *           type: string
 *           enum: [reunion, hors_reunion]
 *         meetingReference:
 *           type: string
 *         comment:
 *           type: string
 */

// 2.1 Create validation
/**
 * @swagger
 * /validations:
 *   post:
 *     summary: Create a new validation
 *     tags: [Validations]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Validation'
 *     responses:
 *       201:
 *         description: Validation created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post(
  "/",
  authenticateToken,
  authorizeSupervisor,
  validate(ValidationSchema),
  validationController.createValidation
);

// 2.2 List validations for a task
/**
 * @swagger
 * /validations/task/{taskId}:
 *   get:
 *     summary: List validations for a task
 *     tags: [Validations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of validations
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  "/task/:taskId",
  authenticateToken,
  authorizeSupervisor,
  validationController.getValidationsByTask
);

// 2.3 Delete validation
/**
 * @swagger
 * /validations/{id}:
 *   delete:
 *     summary: Delete a validation
 *     tags: [Validations]
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
 *         description: Validation deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
  "/:id",
  authenticateToken,
  authorizeSupervisor,
  validationController.deleteValidation
);

export default router;
