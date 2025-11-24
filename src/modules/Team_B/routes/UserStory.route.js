import express from "express";
import userStoryController from "../UserStoryController.js";
import { authorizeStudent } from "../middlewares/auth.middleware.js";
import { authenticateToken } from "../../Authentication/middlewares/auth.middleware.js";

import { validate } from "../../../shared/middlewares/validate.js";
import { UserStorySchema } from "../validators/UserStory.validator.js";

const router = express.Router();

// POST /:sprintId
router.post("/:idSprint", authenticateToken, authorizeStudent, validate(UserStorySchema),  userStoryController.createUserStory);


export default router;
