// routes/validation.routes.js
import express from "express";
import { authenticateToken } from "../../Authentication/middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import * as validationController from "../controllers/validation.controller.js";

const router = express.Router();

// 2.1 Create validation
router.post(
  "/",
  authenticateToken,
  roleMiddleware(["Enc_Company", "Enc_University"]),
  validationController.createValidation
);

// 2.2 List validations for a task
router.get(
  "/task/:taskId",
  authenticateToken,
  validationController.getValidationsByTask
);

// 2.3 Delete validation
router.delete(
  "/:id",
  authenticateToken,
  roleMiddleware(["Enc_Company", "Enc_University"]),
  validationController.deleteValidation
);

export default router;
