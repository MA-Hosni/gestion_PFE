import express from "express";
import upload from "../middlewares/UploadReport.middleware.js";
import { authenticateToken, authorizeStudent, authorizeSupervisor } from "../../../shared/middlewares/auth.middleware.js"; 
import { validate } from "../../../shared/middlewares/validate.js";
import { createReportSchema, updateReportSchema } from "../validators/Report.validator.js";
import * as reportController from "../controllers/Report.controller.js";

const router = express.Router();

// Create Report
/**
 * @swagger
 * /report:
 *   post:
 *     summary: Create a new report
 *     description: Creates a new report with file upload. The version label must be unique within the project. Students can upload reports for their projects.
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - versionLabel
 *               - notes
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Report file to upload (PDF, DOCX, etc.)
 *               versionLabel:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *                 description: Version number of the report (must be unique per project)
 *               notes:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 5000
 *                 example: This is the first version of the project report covering the analysis phase.
 *                 description: Notes and description for this report version
 *     responses:
 *       201:
 *         description: Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Report created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Student has no assigned project
 *       409:
 *         description: Version label already exists for this project
 */
router.post("/", authenticateToken, authorizeStudent, upload.single("file"), validate(createReportSchema), reportController.createReport);

// Update Report
/**
 * @swagger
 * /report/{id}:
 *   patch:
 *     summary: Update a report's notes
 *     description: Updates the notes of an existing report. Version label and file cannot be updated through this endpoint.
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The report ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notes
 *             properties:
 *               notes:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 5000
 *                 example: Updated notes with additional information about the project progress.
 *                 description: Updated notes and description for this report
 *     responses:
 *       200:
 *         description: Report updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Report updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Report does not belong to your project
 *       404:
 *         description: Report not found or deleted
 */
router.patch("/:id", authenticateToken, authorizeStudent, validate(updateReportSchema), reportController.updateReport);

// Get All Reports for Student
/**
 * @swagger
 * /report:
 *   get:
 *     summary: Get all reports for authenticated student
 *     description: Retrieves all non-deleted reports belonging to the authenticated student's project
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Reports retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Student has no assigned project
 */
router.get("/", authenticateToken, authorizeStudent, reportController.getAllReports);

// Get Report by ID for Student
/**
 * @swagger
 * /report/{id}:
 *   get:
 *     summary: Get a report by ID
 *     description: Retrieves detailed information about a specific report including its file path and version
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The report ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Report retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Report does not belong to your project
 *       404:
 *         description: Report not found or deleted
 */
router.get("/:id", authenticateToken, authorizeStudent, reportController.getReportById);

// Get All Reports for Company Supervisor
/**
 * @swagger
 * /report/companysup/{projectID}:
 *   get:
 *     summary: Get all reports of a project for company supervisor
 *     description: Retrieves all non-deleted reports of a specific project. Only accessible by the company supervisor assigned to the project.
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectID
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *         example: 507f1f77bcf86cd799439010
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Reports retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: You are not the company supervisor for this project
 *       404:
 *         description: Project not found
 */
router.get("/companysup/:projectID", authenticateToken, authorizeSupervisor, reportController.getAllReportCompanySupervisor);

// Get All Reports for University Supervisor
/**
 * @swagger
 * /report/unisup/{projectID}:
 *   get:
 *     summary: Get all reports of a project for university supervisor
 *     description: Retrieves all non-deleted reports of a specific project. Only accessible by the university supervisor assigned to the project.
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectID
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *         example: 507f1f77bcf86cd799439010
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Reports retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: You are not the university supervisor for this project
 *       404:
 *         description: Project not found
 */
router.get("/unisup/:projectID", authenticateToken, authorizeSupervisor, reportController.getAllReportsUniSupervisor);

// Delete Report
/**
 * @swagger
 * /report/{id}:
 *   delete:
 *     summary: Delete a report
 *     description: Soft deletes a report by setting the deletedAt timestamp. The file remains in storage but the report is marked as deleted. Only the student who created the report can delete it.
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The report ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Report deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     reportId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     versionLabel:
 *                       type: integer
 *                       example: 1
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Report does not belong to your project
 *       404:
 *         description: Report not found or already deleted
 */
router.delete("/:id", authenticateToken, authorizeStudent, reportController.deleteReport);

export default router;