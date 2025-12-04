import express from "express";
import userStoryRoutes from "./routes/UserStory.routes.js";
//import sprintRoutes from "./routes/sprint.routes.js";
import reportRoutes from "./routes/Report.routes.js";

const router = express.Router();

router.use("/userStory", userStoryRoutes);
router.use("/report", reportRoutes);
export default router;
