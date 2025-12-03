import express from "express";
import { authenticateToken, authorizeStudent, authorizeSupervisor } from "../../../shared/middlewares/auth.middleware.js";
import * as dashboardController from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get("/projects", authenticateToken, authorizeSupervisor, dashboardController.getAllProjects);
router.get("/:projectId", authenticateToken, dashboardController.getProgress);
router.get("/student/timeline", authenticateToken, authorizeStudent, dashboardController.getStudentTimeline);
router.get("/student/tasks/standby", authenticateToken, authorizeStudent, dashboardController.getStudentStandbyTasks);
router.get("/supervisor/timeline", authenticateToken, authorizeSupervisor, dashboardController.getSupervisorTimeline);
router.get("/supervisor/validations/:projectId", authenticateToken, authorizeSupervisor, dashboardController.getSupervisorPendingValidations);
router.get("/supervisor/meetings/:projectId", authenticateToken, authorizeSupervisor, dashboardController.getSupervisorLatestMeetings);

export default router;