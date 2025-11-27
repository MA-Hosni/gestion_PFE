import express from "express";
import { authenticateToken } from "../../Authentication/middlewares/auth.middleware.js";
import { authorizeStudent, authorizeSupervisor } from "../middlewares/auth.middleware.js";
import * as dashboardController from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get("/projects", authenticateToken, authorizeSupervisor, dashboardController.getAllProjects);
router.get('/:projectId', authenticateToken, dashboardController.getDashboard);

export default router;