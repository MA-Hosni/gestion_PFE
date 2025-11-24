import express from "express";
import projectRoutes from "./routes/project.routes.js";
// import sprintRoutes from "./routes/sprint.routes.js";

const router = express.Router();

router.use("/projects", projectRoutes);
// router.use("/sprints", sprintRoutes);

export default router;