// Team_D/routes/meeting.routes.js

import express from "express";
import {
  authenticateToken,
  authorizeStudent,
  authorizeSupervisor,
  authorizeUniversitySupervisor
} from "../../../shared/middlewares/auth.middleware.js";

import { validate } from "../../../shared/middlewares/validate.js";
import { MeetingSchema,
  CompleteMeetingSchema,
  ValidateMeetingSchema,
  ChangeReferenceSchema
} from "../validators/meeting.validator.js";

import * as meetingController from "../controllers/meeting.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Meetings
 *   description: Meeting management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Meeting:
 *       type: object
 *       required:
 *         - scheduledDate
 *         - referenceType
 *         - referenceId
 *       properties:
 *         scheduledDate:
 *           type: string
 *           format: date-time
 *         agenda:
 *           type: string
 *         actualMinutes:
 *           type: string
 *         referenceType:
 *           type: string
 *           enum: [user_story, task, report]
 *         referenceId:
 *           type: string
 *         validationStatus:
 *           type: string
 *           enum: [pending, valid, invalid]
 *     CompleteMeeting:
 *       type: object
 *       required:
 *         - actualMinutes
 *       properties:
 *         actualMinutes:
 *           type: string
 *     ValidateMeeting:
 *       type: object
 *       required:
 *         - validationStatus
 *       properties:
 *         validationStatus:
 *           type: string
 *           enum: [valid, invalid]
 *     ChangeReference:
 *       type: object
 *       required:
 *         - referenceType
 *         - referenceId
 *       properties:
 *         referenceType:
 *           type: string
 *           enum: [user_story, task, report]
 *         referenceId:
 *           type: string
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
 *             $ref: '#/components/schemas/Meeting'
 *     responses:
 *       201:
 *         description: Meeting created successfully
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
 *     summary: Update a meeting
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
 *             $ref: '#/components/schemas/Meeting'
 *     responses:
 *       200:
 *         description: Meeting updated successfully
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
 *     summary: Complete meeting minutes
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
 *             $ref: '#/components/schemas/CompleteMeeting'
 *     responses:
 *       200:
 *         description: Meeting completed successfully
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
 *     summary: Validate meeting
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
 *             $ref: '#/components/schemas/ValidateMeeting'
 *     responses:
 *       200:
 *         description: Meeting validated successfully
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
 *     summary: List meetings by student
 *     tags: [Meetings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of meetings
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
// 6. LIST MEETINGS (GET /meetings?projectId=xxx)
// =======================================================
/**
 * @swagger
 * /meetings/project/{projectId}:
 *   get:
 *     summary: List meetings by project
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
// 7. LIST MEETINGS BY REFERENCE (GET /meetings/reference/:type/:id)
// =======================================================
/**
 * @swagger
 * /meetings/reference/{type}/{id}:
 *   get:
 *     summary: List meetings by reference
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  "/reference/:type/:id",
  authenticateToken,
  meetingController.listMeetingsByReference
);


// =======================================================
// 8. CHANGE MEETING REFERENCE (PATCH /meetings/:id/reference)
// =======================================================
/**
 * @swagger
 * /meetings/{id}/reference:
 *   patch:
 *     summary: Change meeting reference
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
 *             $ref: '#/components/schemas/ChangeReference'
 *     responses:
 *       200:
 *         description: Meeting reference changed successfully
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
// 9. LIST PENDING VALIDATION (GET /meetings/pending-validation)
// Encadrant universitaire ONLY
// =======================================================
/**
 * @swagger
 * /meetings/pending-validation:
 *   get:
 *     summary: List pending validation meetings
 *     tags: [Meetings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending validation meetings
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
