import express from "express";
import meetingRoutes from "./routes/meeting.routes.js";
import validationRoutes from "./routes/validation.routes.js";

const teamDRouter = express.Router();

// Team D modules
teamDRouter.use("/meetings", meetingRoutes);
teamDRouter.use("/validations", validationRoutes);

export default teamDRouter;
