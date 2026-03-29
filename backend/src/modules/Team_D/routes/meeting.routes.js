// Team_D/routes/meeting.routes.js

import express from "express";
import {
  authenticateToken,
  authorizeStudent,
  authorizeSupervisor,
  authorizeUniversitySupervisor,
} from "../../../shared/middlewares/auth.middleware.js";

import { validate } from "../../../shared/middlewares/validate.js";
import {
  MeetingSchema,
  CompleteMeetingSchema,
  ValidateMeetingSchema,
  ChangeReferenceSchema,
} from "../validators/meeting.validator.js";

import * as meetingController from "../controllers/meeting.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Meetings
 *   description: Meeting management (Create, Update, Validate, Complete)
 */

// =======================================================
// 1. CREATE MEETING (POST /meetings)
// =======================================================
/**
 * @swagger
 * /meetings:
 *   post:
 *     summary: Create a new meeting
 *     tags: [Meetings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMeetingRequest'
 *     responses:
 *       201:
 *         description: Meeting created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  "/",
  authenticateToken,
  authorizeStudent,
  validate(MeetingSchema),
  meetingController.createMeeting
);

// =======================================================
// 2. UPDATE MEETING (PUT /meetings/:id)
// =======================================================
/**
 * @swagger
 * /meetings/{id}:
 *   put:
 *     summary: Update a meeting details
 *     tags: [Meetings]
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
 *             $ref: '#/components/schemas/CreateMeetingRequest'
 *     responses:
 *       200:
 *         description: Meeting updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  "/:id",
  authenticateToken,
  authorizeStudent,
  validate(MeetingSchema),
  meetingController.updateMeeting
);

// =======================================================
// 3. DELETE MEETING (DELETE /meetings/:id)
// =======================================================
/**
 * @swagger
 * /meetings/{id}:
 *   delete:
 *     summary: Delete a meeting
 *     tags: [Meetings]
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
 *         description: Meeting deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
  "/:id",
  authenticateToken,
  authorizeStudent,
  meetingController.deleteMeeting
);

// =======================================================
// 4. COMPLETE MEETING MINUTES (PATCH /meetings/:id/complete)
// =======================================================
/**
 * @swagger
 * /meetings/{id}/complete:
 *   patch:
 *     summary: Complete meeting minutes (Student)
 *     tags: [Meetings]
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
 *             $ref: '#/components/schemas/CompleteMeetingRequest'
 *     responses:
 *       200:
 *         description: Meeting completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch(
  "/:id/complete",
  authenticateToken,
  authorizeStudent,
  validate(CompleteMeetingSchema),
  meetingController.completeMeeting
);

// =======================================================
// 5. VALIDATE MEETING (PATCH /meetings/:id/validate)
// =======================================================
/**
 * @swagger
 * /meetings/{id}/validate:
 *   patch:
 *     summary: Validate meeting (University Supervisor)
 *     tags: [Meetings]
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
 *             $ref: '#/components/schemas/ValidateMeetingRequest'
 *     responses:
 *       200:
 *         description: Meeting validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch(
  "/:id/validate",
  authenticateToken,
  authorizeUniversitySupervisor,
  validate(ValidateMeetingSchema),
  meetingController.validateMeeting
);

// =======================================================
// 6. LIST MEETINGS BY STUDENT (GET /meetings)
// =======================================================
/**
 * @swagger
 * /meetings:
 *   get:
 *     summary: List meetings for the current student
 *     tags: [Meetings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of meetings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meeting'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  "/",
  authenticateToken,
  authorizeStudent,
  meetingController.listMeetingsByStudent
);

// =======================================================
// 7. LIST MEETINGS BY PROJECT (GET /meetings/project/:projectId)
// =======================================================
/**
 * @swagger
 * /meetings/project/{projectId}:
 *   get:
 *     summary: List meetings for a specific project
 *     tags: [Meetings]
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
 *         description: List of meetings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meeting'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  "/project/:projectId",
  authenticateToken,
  authorizeSupervisor,
  meetingController.listMeetingsByProject
);

// =======================================================
// 8. LIST MEETINGS BY REFERENCE (GET /meetings/reference/:type/:id)
// =======================================================
/**
 * @swagger
 * /meetings/reference/{type}/{id}:
 *   get:
 *     summary: List meetings by reference (e.g., all meetings for a specific User Story)
 *     tags: [Meetings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [user_story, task, report]
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of meetings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meeting'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  "/reference/:type/:id",
  authenticateToken,
  meetingController.listMeetingsByReference
);

// =======================================================
// 9. CHANGE MEETING REFERENCE (PATCH /meetings/:id/reference)
// =======================================================
/**
 * @swagger
 * /meetings/{id}/reference:
 *   patch:
 *     summary: Change the object a meeting is referencing
 *     tags: [Meetings]
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
 *             $ref: '#/components/schemas/ChangeReferenceRequest'
 *     responses:
 *       200:
 *         description: Meeting reference changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch(
  "/:id/reference",
  authenticateToken,
  authorizeStudent,
  validate(ChangeReferenceSchema),
  meetingController.changeMeetingReference
);

// =======================================================
// 10. LIST PENDING VALIDATION (GET /meetings/pending-validation)
// =======================================================
/**
 * @swagger
 * /meetings/pending-validation:
 *   get:
 *     summary: List meetings waiting for validation (University Supervisor only)
 *     tags: [Meetings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending validation meetings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meeting'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  "/pending-validation",
  authenticateToken,
  authorizeSupervisor,
  meetingController.listPendingValidation
);

export default router;
