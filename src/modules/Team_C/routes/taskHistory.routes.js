const express = require("express")
const router = express.Router()
import { authenticateToken } from "../../Authentication/middlewares/auth.middleware.js"
import{authorizeStudent , authorizeSupervisor} from "../../Team_A/middlewares/auth.middleware.js"
const taskHistoryController = require("../controllers/taskHistory.controller")

router.post("/", authenticateToken, authorizeStudent, taskHistoryController.createHistory)
router.get("/:task_id", authenticateToken, authorizeStudent , authorizeSupervisor, taskHistoryController.getHistoryByTask)
router.delete("/:id", authenticateToken, authorizeSupervisor, taskHistoryController.deleteHistory)

module.exports = router
