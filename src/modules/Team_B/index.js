import express from "express";
import userStoryRoutes from "./routes/UserStory.route.js";

const router = express.Router();

router.use("/userStory", userStoryRoutes);

export default router;