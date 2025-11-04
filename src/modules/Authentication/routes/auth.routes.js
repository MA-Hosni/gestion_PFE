import express from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../../../shared/middlewares/validate.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { 
  studentSignupSchema, 
  companySupervisorSignupSchema, 
  universitySupervisorSignupSchema, 
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema
} from "../validators/auth.validator.js";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

// Rate limiting configurations
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: "Too many signup attempts from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: "Too many login attempts from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

const verificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: "Too many verification attempts from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { message: "Too many password reset attempts from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

router.post("/signup/student", signupLimiter, validate(studentSignupSchema), authController.signupStudent);
router.post("/signup/supervisor-company", signupLimiter, validate(companySupervisorSignupSchema), authController.signupCompanySupervisor);
router.post("/signup/supervisor-university", signupLimiter, validate(universitySupervisorSignupSchema), authController.signupUniversitySupervisor);
router.get("/verify-email", verificationLimiter, authController.verifyEmail);
router.post("/login", loginLimiter, validate(loginSchema), authController.login);
router.post("/complete-signup", authController.completeSignup);
router.post("/refresh-token", authController.refreshToken);
router.post("/request-password-reset", passwordResetLimiter, validate(passwordResetRequestSchema), authController.requestPasswordReset);
router.post("/reset-password", passwordResetLimiter, validate(passwordResetSchema), authController.resetPassword);

router.post("/logout", authenticateToken, authController.logout);

export default router;