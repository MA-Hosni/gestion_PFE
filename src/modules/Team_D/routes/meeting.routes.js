// Team_D/routes/meeting.routes.js

import express from "express";
import { authenticateToken } from "../../../shared/middlewares/auth.middleware.js";
import {
  authorizeStudent,
  authorizeSupervisor
} from "../../../shared/middlewares/auth.middleware.js";

import { validate } from "../../../shared/middlewares/validate.js";
import { MeetingSchema,
  CompleteMeetingSchema,
  ValidateMeetingSchema,
  ChangeReferenceSchema
} from "../validators/meeting.validator.js";

import * as meetingController from "../controllers/meeting.controller.js";

const router = express.Router();


// =======================================================
// 1. CREATE MEETING (POST /meetings)
// =======================================================
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
router.delete(
  "/:id",
  authenticateToken,
  authorizeStudent,
  meetingController.deleteMeeting
);


// =======================================================
// 4. COMPLETE MEETING MINUTES (PATCH /meetings/:id/complete)
// =======================================================
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
router.patch(
  "/:id/validate",
  authenticateToken,
  authorizeSupervisor,
  validate(ValidateMeetingSchema),
  meetingController.validateMeeting 
);


// =======================================================
// 6. LIST MEETINGS BY STUDENT (GET /meetings)
// =======================================================
router.get(
  "/",
  authenticateToken,
  authorizeStudent,
  meetingController.listMeetingsByStudent
);

// =======================================================
// 6. LIST MEETINGS (GET /meetings?projectId=xxx)
// =======================================================
router.get(
  "/project/:projectId",
  authenticateToken,
  authorizeSupervisor,
  meetingController.listMeetingsByProject
);

// =======================================================
// 7. LIST MEETINGS BY REFERENCE (GET /meetings/reference/:type/:id)
// =======================================================
router.get(
  "/reference/:type/:id",
  authenticateToken,
  meetingController.listMeetingsByReference
);


// =======================================================
// 8. CHANGE MEETING REFERENCE (PATCH /meetings/:id/reference)
// =======================================================
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
router.get(
  "/pending-validation",
  authenticateToken,
  authorizeSupervisor,
  meetingController.listPendingValidation
);


export default router;
