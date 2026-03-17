import express from "express";
import { authenticateToken, authorizeStudent } from "../../../shared/middlewares/auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.js";
import { ProjectSchema, UpdateProjectSchema, AddRemoveContributorsSchema } from "../validators/project.validator.js";
import * as projectController from "../controllers/project.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/", authenticateToken, authorizeStudent, validate(ProjectSchema), projectController.createProject);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get project details
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/", authenticateToken, authorizeStudent, projectController.getProject);

/**
 * @swagger
 * /projects:
 *   patch:
 *     summary: Update project details
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch("/", authenticateToken, authorizeStudent, validate(UpdateProjectSchema), projectController.updateProject);

/**
 * @swagger
 * /projects:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/", authenticateToken, authorizeStudent, projectController.deleteProject);

/**
 * @swagger
 * /projects/students/without-project:
 *   get:
 *     summary: Get students without a project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of students without a project
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   fullName:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/students/without-project", authenticateToken, authorizeStudent, projectController.getStudentsWithoutProject);

/**
 * @swagger
 * /projects/students/add-contributors:
 *   patch:
 *     summary: Add contributors to a project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddRemoveContributors'
 *     responses:
 *       200:
 *         description: Contributors added successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch("/students/add-contributors", authenticateToken, authorizeStudent, validate(AddRemoveContributorsSchema), projectController.addContributors);

/**
 * @swagger
 * /projects/students/remove-contributors:
 *   patch:
 *     summary: Remove contributors from a project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddRemoveContributors'
 *     responses:
 *       200:
 *         description: Contributors removed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch("/students/remove-contributors", authenticateToken, authorizeStudent, validate(AddRemoveContributorsSchema), projectController.removeContributors);

export default router;