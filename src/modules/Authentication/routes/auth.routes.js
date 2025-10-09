import express from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../middlewares/validate.js";
import { studentSignupSchema, companySupervisorSignupSchema, universitySupervisorSignupSchema, loginSchema } from "../validators/auth.validator.js";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: "Too many signup attempts from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

router.post("/signup/student", signupLimiter, validate(studentSignupSchema), authController.signupStudent);
router.post("/signup/supervisor-company", signupLimiter, validate(companySupervisorSignupSchema), authController.signupCompany);
router.post("/signup/supervisor-university", signupLimiter, validate(universitySupervisorSignupSchema), authController.signupUniversity);
// router.post("/login", validate(loginSchema), authController.login);
// router.post("/logout", authController.logout);

export default router;