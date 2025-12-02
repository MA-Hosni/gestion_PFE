import express from "express";
import { authenticateToken } from "../../Authentication/middlewares/auth.middleware.js";
import { authorizeStudent, authorizeSupervisor } from "../../Team_A/middlewares/auth.middleware.js";

import { validate } from "../../../shared/middlewares/validate.js";
import { createUserStorySchema , updateUserStorySchema } from "../validators/UserStory.validator.js";

import * as userStoryController from "../controllers/UserStory.controller.js";

const router = express.Router();


// create User Storie 
router.post("/",authenticateToken,authorizeStudent,validate(createUserStorySchema),userStoryController.createUserStory);

// Get all User Stories of student's project
router.get("/",authenticateToken,authorizeStudent,userStoryController.getUserStories);

//Get all User Stories related to sprint
router.get("/sprint/:sprintId",authenticateToken,authorizeStudent,userStoryController.getUserStoriesRelatedToSprint);

// get user storie by id 
router.get("/:userStoryId",authenticateToken,authorizeStudent,userStoryController.getUserStoryById);

router.put("/:userStoryId", authenticateToken, authorizeStudent, validate(updateUserStorySchema), userStoryController.updateUserStory);

router.delete("/:userStoryId",authenticateToken,authorizeStudent,userStoryController.deleteUserStory);

export default router;