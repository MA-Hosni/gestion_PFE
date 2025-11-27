import express from "express";
import userStoryRoutes from "./routes/UserStory.route.js";
// import sprintRoutes from "./routes/sprint.routes.js";

const router = express.Router();

router.use("/userStory", userStoryRoutes);
// router.use("/sprints", sprintRoutes);

export default router;