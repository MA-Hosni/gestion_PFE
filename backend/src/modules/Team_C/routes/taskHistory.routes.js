import { authenticateToken } from "../../../shared/middlewares/auth.middleware.js";
import { getHistoryByTask } from "../controllers/taskHistory.controller.js";
import express from "express"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Task History
 *   description: Task history management
 */

/**
 * @swagger
 * /tasks/history/{task_id}:
 *   get:
 *     summary: Get history by task ID
 *     tags: [Task History]
 *     parameters:
 *       - in: path
 *         name: task_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task history
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:task_id", authenticateToken, getHistoryByTask)

export default router

