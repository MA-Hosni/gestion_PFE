const express = require("express")
const router = express.Router()
const { authMiddleware, roleMiddleware } = require("../../Authentication/middlewares/auth")
const taskHistoryController = require("../controllers/taskHistory.controller")

router.post("/", authMiddleware, roleMiddleware(["Student"]), taskHistoryController.createHistory)
router.get("/:task_id", authMiddleware, roleMiddleware(["Student", "Enc_University", "Enc_Pro"]), taskHistoryController.getHistoryByTask)
router.delete("/:id", authMiddleware, roleMiddleware(["Enc_University", "Enc_Pro"]), taskHistoryController.deleteHistory)

module.exports = router
