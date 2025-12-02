import express from "express";
import userStoryRoutes from "./routes/UserStory.routes.js";
// import sprintRoutes from "./routes/sprint.routes.js";

const router = express.Router();

router.use("/userStory", userStoryRoutes);

export default router;