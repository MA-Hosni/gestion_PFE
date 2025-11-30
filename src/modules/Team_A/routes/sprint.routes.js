import express from "express";
import { authenticateToken, authorizeStudent } from "../../../shared/middlewares/auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.js";
import {
  SprintSchema,
  updateSprintSchema,
  reorderSprintsSchema
} from "../validators/sprint.validator.js";
import * as sprintController from "../controllers/sprint.controller.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeStudent, validate(SprintSchema), sprintController.createSprint);
router.patch("/reorder", authenticateToken, authorizeStudent, validate(reorderSprintsSchema), sprintController.reorderSprints);
router.patch("/:sprintId", authenticateToken, authorizeStudent, validate(updateSprintSchema), sprintController.updateSprint);
router.delete("/:sprintId", authenticateToken, authorizeStudent, sprintController.deleteSprint);

export default router;