// src/modules/Team_D/routes/validation.routes.js
import express from "express";
import { authenticateToken } from "../../../shared/middlewares/auth.middleware.js";
import {
  authorizeStudent,
  authorizeSupervisor
} from "../../../shared/middlewares/auth.middleware.js";
import * as validationController from "../controllers/validation.controller.js";
import { validate } from "../../../shared/middlewares/validate.js";
import { ValidationSchema } from "../validators/validation.validator.js";

const router = express.Router();

// 2.1 Create validation
router.post(
  "/",
  authenticateToken,
  authorizeSupervisor,
  validate(ValidationSchema),
  validationController.createValidation
);

// 2.2 List validations for a task
router.get(
  "/task/:taskId",
  authenticateToken,
  authorizeSupervisor,
  validationController.getValidationsByTask
);

// 2.3 Delete validation
router.delete(
  "/:id",
  authenticateToken,
  authorizeSupervisor,
  validationController.deleteValidation
);

export default router;
