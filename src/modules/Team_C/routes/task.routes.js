import express from "express"
import { authMiddleware, roleMiddleware } from "../../Authentication/middlewares/auth.js"
import * as taskController from "../controllers/task.controller.js"

const router = express.Router()

router.post("/", authMiddleware, roleMiddleware(["Student"]), taskController.createTask)
router.get("/", authMiddleware, roleMiddleware(["Student", "CompSupervisor", "UniSupervisor"]), taskController.getAllTasks)
router.get("/:id", authMiddleware, roleMiddleware(["Student", "CompSupervisor", "UniSupervisor"]), taskController.getTaskById)
router.patch("/:id", authMiddleware, roleMiddleware(["Student"]), taskController.updateTask)
router.delete("/:id", authMiddleware, roleMiddleware(["Student"]), taskController.deleteTask)

export default router
