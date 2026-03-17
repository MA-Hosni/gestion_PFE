import express from "express";
import projectRoutes from "./routes/project.routes.js";
import sprintRoutes from "./routes/sprint.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const router = express.Router();

router.use("/project", projectRoutes);
router.use("/project/sprints", sprintRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;