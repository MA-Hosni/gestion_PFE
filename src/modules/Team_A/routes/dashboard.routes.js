import express from "express";
import { authenticateToken, authorizeSupervisor } from "../../../shared/middlewares/auth.middleware.js";
import * as dashboardController from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get("/projects", authenticateToken, authorizeSupervisor, dashboardController.getAllProjects);
router.get("/:projectId", authenticateToken, dashboardController.getProgress);

export default router;