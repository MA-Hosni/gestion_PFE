import express from "express";
import { authenticateToken } from "../../Authentication/middlewares/auth.middleware.js";
import { authorizeStudent } from "../middlewares/auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.js";
import {
  SprintSchema,
  updateSprintSchema,
  reorderSprintsSchema
} from "../validators/sprint.validator.js";
import * as sprintController from "../controllers/sprint.controller.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeStudent, validate(SprintSchema), sprintController.createSprint);
router.put("/:sprintId", authenticateToken, authorizeStudent, validate(updateSprintSchema), sprintController.updateSprint);
router.delete("/:sprintId", authenticateToken, authorizeStudent, sprintController.deleteSprint);
router.patch("/reorder", authenticateToken, authorizeStudent, validate(reorderSprintsSchema), sprintController.reorderSprints);

export default router;