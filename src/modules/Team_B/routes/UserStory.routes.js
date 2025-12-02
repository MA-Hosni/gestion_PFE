import express from "express";
import { authenticateToken } from "../../Authentication/middlewares/auth.middleware.js";
import { authorizeStudent, authorizeSupervisor } from "../../Team_A/middlewares/auth.middleware.js";

import { validate } from "../../../shared/middlewares/validate.js";
import { createUserStorySchema , updateUserStorySchema } from "../validators/UserStory.validator.js";

import * as userStoryController from "../controllers/UserStory.controller.js";

const router = express.Router();
// create User Storie 
/**
 * @swagger
 * /userstories:
 *   post:
 *     summary: Create a new user story
 *     description: Creates a new user story within a sprint. The user story name must be unique within the sprint.
 *     tags: [User Stories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserStoryRequest'
 *     responses:
 *       201:
 *         description: User story created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User story created successfully
 *                 data:
 *                   $ref: '#/components/schemas/UserStory'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Sprint not found
 *       409:
 *         description: User story name already exists in this sprint
 */
router.post("/",authenticateToken,authorizeStudent,validate(createUserStorySchema),userStoryController.createUserStory);

// Get all User Stories of student's project
/**
 * @swagger
 * /userstories:
 *   get:
 *     summary: Get all user stories of student's project
 *     description: Retrieves all user stories belonging to the authenticated student's project
 *     tags: [User Stories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user stories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User stories retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserStory'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Student has no assigned project
 */
router.get("/",authenticateToken,authorizeStudent,userStoryController.getUserStories);

//Get all User Stories related to sprint
/**
 * @swagger
 * /userstories/sprint/{sprintId}:
 *   get:
 *     summary: Get all user stories related to a specific sprint
 *     description: Retrieves all user stories belonging to a specific sprint within the student's project
 *     tags: [User Stories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sprintId
 *         required: true
 *         schema:
 *           type: string
 *         description: The sprint ID
 *         example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: User stories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User stories retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserStory'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Sprint does not belong to your project
 *       404:
 *         description: Sprint not found or deleted
 */
router.get("/sprint/:sprintId",authenticateToken,authorizeStudent,userStoryController.getUserStoriesRelatedToSprint);

// get user storie by id 
/**
 * @swagger
 * /userstories/{userStoryId}:
 *   get:
 *     summary: Get a user story by ID
 *     description: Retrieves detailed information about a specific user story, including associated sprint and tasks
 *     tags: [User Stories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userStoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user story ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: User story retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User story retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/UserStory'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: User story does not belong to your project
 *       404:
 *         description: User story not found or deleted
 */
router.get("/:userStoryId",authenticateToken,authorizeStudent,userStoryController.getUserStoryById);

// Update user storie by id
/**
 * @swagger
 * /userstories/{userStoryId}:
 *   put:
 *     summary: Update a user story
 *     description: Updates an existing user story. Can change any field including moving it to another sprint.
 *     tags: [User Stories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userStoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user story ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserStoryRequest'
 *     responses:
 *       200:
 *         description: User story updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User story updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/UserStory'
 *       400:
 *         description: Validation error (e.g., due date must be after start date)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: User story does not belong to your project
 *       404:
 *         description: User story or sprint not found
 *       409:
 *         description: User story name already exists in the target sprint
 */
router.put("/:userStoryId", authenticateToken, authorizeStudent, validate(updateUserStorySchema), userStoryController.updateUserStory);

// Delete user storie by id
/**
 * @swagger
 * /userstories/{userStoryId}:
 *   delete:
 *     summary: Delete a user story
 *     description: Soft deletes a user story and all its associated tasks. The user story is marked as deleted but not removed from the database.
 *     tags: [User Stories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userStoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user story ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: User story and associated tasks deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User story and associated tasks deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     userStoryId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     storyName:
 *                       type: string
 *                       example: User Authentication System
 *                     deletedTasksCount:
 *                       type: number
 *                       example: 5
 *                       description: Number of tasks that were deleted
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: User story does not belong to your project
 *       404:
 *         description: User story not found or already deleted
 */
router.delete("/:userStoryId",authenticateToken,authorizeStudent,userStoryController.deleteUserStory);

export default router;