const express = require("express");
const router = express.Router();
const controller = require("../controllers/taskController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/", auth, role(["Student"]), controller.createTask);
router.get("/", auth, role(["Student", "Enc_University", "Enc_Pro"]), controller.getAllTasks);
router.get("/:id", auth, role(["Student", "Enc_University", "Enc_Pro"]), controller.getTaskById);
router.patch("/:id", auth, role(["Student"]), controller.updateTask);
router.delete("/:id", auth, role(["Student"]), controller.deleteTask);

module.exports = router;
