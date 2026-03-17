import express from "express"
import taskRoutes from "./routes/task.routes.js"

const router = express.Router()

router.use("/tasks", taskRoutes)

export default router