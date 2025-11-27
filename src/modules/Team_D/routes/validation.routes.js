// routes/validation.routes.js
import express from "express";
import { authenticateToken, authorizeSupervisor } from "../../../shared/middlewares/auth.middleware.js";
import * as validationController from "../controllers/validation.controller.js";

const router = express.Router();

// 2.1 Create validation
router.post("/",authenticateToken,authorizeSupervisor,validationController.createValidation);

// 2.2 List validations for a task
router.get("/task/:taskId",authenticateToken,validationController.getValidationsByTask);

// 2.3 Delete validation
router.delete("/:id",authenticateToken,authorizeSupervisor,validationController.deleteValidation);

export default router;
