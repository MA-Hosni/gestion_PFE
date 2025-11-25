import express from "express";
import { authenticateToken } from "../../Authentication/middlewares/auth.middleware.js";
import { authorizeStudent, authorizeSupervisor } from "../../Team_A/middlewares/auth.middleware.js";

import { validate } from "../../../shared/middlewares/validate.js";
import { createUserStorySchema } from "../validators/UserStory.validator.js";

import * as userStoryController from "../controllers/UserStory.controller.js";

const router = express.Router();

router.post("/",authenticateToken,authorizeStudent,validate(createUserStorySchema),userStoryController.createUserStory);

/**
 * Get all User Stories for student's project
 * GET /
 */
// router.get("/",authenticateToken,authorizeStudent,userStoryController.getUserStories);

// /**
//  * Update User Story
//  * PUT /:id
//  */
// router.put("/:id",authenticateToken,authorizeStudent,validate(UserStorySchema),userStoryController.updateUserStory);

// /**
//  * Delete User Story
//  * DELETE /:id
//  */
// router.delete("/:id",authenticateToken,authorizeStudent,userStoryController.deleteUserStory);

// /**
//  * Assign sprint to User Story
//  * PUT /assign-sprint
//  */
// router.put("/assign-sprint",authenticateToken,authorizeStudent,userStoryController.assignSprint);

export default router;
