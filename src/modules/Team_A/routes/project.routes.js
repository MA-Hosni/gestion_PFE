import express from "express";
import { authenticateToken, authorizeStudent } from "../../../shared/middlewares/auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.js";
import { ProjectSchema, UpdateProjectSchema, AddRemoveContributorsSchema } from "../validators/project.validator.js";
import * as projectController from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeStudent, validate(ProjectSchema), projectController.createProject);
router.get("/", authenticateToken, authorizeStudent, projectController.getProject);
router.patch("/", authenticateToken, authorizeStudent, validate(UpdateProjectSchema), projectController.updateProject);
router.delete("/", authenticateToken, authorizeStudent, projectController.deleteProject);

router.get("/students/without-project", authenticateToken, authorizeStudent, projectController.getStudentsWithoutProject);
router.patch("/students/add-contributors", authenticateToken, authorizeStudent, validate(AddRemoveContributorsSchema), projectController.addContributors);
router.patch("/students/remove-contributors", authenticateToken, authorizeStudent, validate(AddRemoveContributorsSchema), projectController.removeContributors);

export default router;