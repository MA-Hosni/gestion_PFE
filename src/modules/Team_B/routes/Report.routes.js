import express from "express";
import upload from "../middlewares/uploadReport.middleware.js";
import { authenticateToken } from "../../Authentication/middlewares/auth.middleware.js";
import { authorizeStudent } from "../../Team_A/middlewares/auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.js";
import { createReportSchema } from "../validators/Report.validator.js";
import * as reportController from "../controllers/Report.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeStudent,
  upload.single("file"),
  validate(createReportSchema),
  reportController.createReport
);

router.get(
  "/",
  authenticateToken,
  authorizeStudent,
  reportController.getAllReports
);

router.get(
  "/:id",
  authenticateToken,
  authorizeStudent,
  reportController.getReportById
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeStudent,
  reportController.deleteReport
);

export default router;

