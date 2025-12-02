import { getHistoryByTask } from "../controllers/taskHistory.controller.js";
import express from "express"

const router = express.Router()

router.get("/:task_id", getHistoryByTask)

export default router

