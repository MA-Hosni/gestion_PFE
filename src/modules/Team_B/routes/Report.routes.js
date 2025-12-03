import express from "express";
import { authenticateToken, authorizeStudent } from "../../../shared/middlewares/auth.middleware.js";
import * as reportController from "../controllers/Report.controller.js";
import upload from "../middlewares/upload.middleware.js"; // on va créer ceci

const router = express.Router();

router.post("/", authenticateToken, authorizeStudent, upload.single("file"), reportController.addReportVersion);
router.get("/", authenticateToken, reportController.getAllVersions);
router.get("/:id", authenticateToken, reportController.getVersionById);
router.delete("/:id", authenticateToken, authorizeStudent, reportController.deleteVersion);

export default router;
