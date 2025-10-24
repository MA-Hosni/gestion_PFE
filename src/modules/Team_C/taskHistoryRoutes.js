const express = require("express");
const router = express.Router();
const controller = require("../controllers/taskHistoryController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/", auth, controller.createTaskHistory);
router.get("/:task_id", auth, controller.getHistoryByTask);
router.delete("/:id", auth, role(["Admin"]), controller.deleteHistoryRecord);

module.exports = router;
