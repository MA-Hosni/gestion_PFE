import express from "express";
import { authenticateToken, authorizeStudent } from "../../../shared/middlewares/auth.middleware.js";
import * as reportController from "../controllers/Report.controller.js";
import upload from "../middlewares/upload.middleware.js"; // on va créer ceci

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report management
 */

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Upload a new report version
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Report uploaded successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/", authenticateToken, authorizeStudent, upload.single("file"), reportController.addReportVersion);

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get all report versions
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of report versions
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", authenticateToken, reportController.getAllVersions);

/**
 * @swagger
 * /reports/{id}:
 *   get:
 *     summary: Get a report version by ID
 *     tags: [Reports]
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
 *         description: Report version details
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", authenticateToken, reportController.getVersionById);

/**
 * @swagger
 * /reports/{id}:
 *   delete:
 *     summary: Delete a report version
 *     tags: [Reports]
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
 *         description: Report version deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", authenticateToken, authorizeStudent, reportController.deleteVersion);

export default router;
