import express from "express";
import { validate } from "../../../shared/middlewares/validate.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { passwordChangeSchema } from "../validators/auth.validator.js";
import * as userController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/supervisors/company", userController.getCompanySupervisors);
router.get("/supervisors/university", userController.getUniversitySupervisors);
router.get("/profile", authenticateToken, userController.getUserProfile);
router.post("/change-password", authenticateToken, validate(passwordChangeSchema), userController.changePassword);

export default router;