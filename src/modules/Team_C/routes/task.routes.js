import express from "express"
import { authenticateToken } from "../../Authentication/middlewares/auth.middleware.js"
import{authorizeStudent , authorizeSupervisor} from "../../Team_A/middlewares/auth.middleware.js"
import * as taskController from "../controllers/task.controller.js"

const router = express.Router()

router.post("/", authenticateToken, authorizeStudent, taskController.createTask)
router.get("/", authenticateToken, authorizeStudent , authorizeSupervisor, taskController.getAllTasks)
router.get("/:id", authenticateToken, authorizeStudent , authorizeSupervisor, taskController.getTaskById)
router.patch("/:id", authenticateToken,authorizeStudent , taskController.updateTask)
router.delete("/:id", authenticateToken, authorizeStudent, taskController.deleteTask)

export default router
