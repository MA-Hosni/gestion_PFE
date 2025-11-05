import express from "express";
import { validate } from "../../../shared/middlewares/validate.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { passwordChangeSchema } from "../validators/auth.validator.js";
import * as userController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/supervisors/company", userController.getCompanySupervisors);
/**
 * @swagger
 * /supervisors/company:
 *   get:
 *     summary: List active company supervisors
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of company supervisors
 */
router.get("/supervisors/university", userController.getUniversitySupervisors);
/**
 * @swagger
 * /supervisors/university:
 *   get:
 *     summary: List active university supervisors
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of university supervisors
 */
router.get("/profile", authenticateToken, userController.getUserProfile);
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/change-password", authenticateToken, validate(passwordChangeSchema), userController.changePassword);
/**
 * @swagger
 * /change-password:
 *   post:
 *     summary: Change current user password
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordChange'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

export default router;