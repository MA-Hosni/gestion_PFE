import express from "express";
import { authenticateToken } from "../../Authentication/middlewares/auth.middleware.js";
import { authorizeStudent, authorizeSupervisor } from "../middlewares/auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.js";
import { ProjectSchema } from "../validators/project.validator.js";
import * as projectController from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeStudent, validate(ProjectSchema), projectController.createProject);
router.get("/", authenticateToken, authorizeStudent, projectController.getProject);
// router.get("/projects", authenticateToken, authorizeSupervisor, projectController.getProjects);
// router.put("/", authenticateToken, authorizeStudent, validate(ProjectSchema), projectController.updateProject);
// router.put("/delete-project", authenticateToken, authorizeStudent, projectController.deleteProject);

router.get("/students/without-project", authenticateToken, authorizeStudent, projectController.getStudentsWithoutProject);
router.put("/students/add-contributors", authenticateToken, authorizeStudent, projectController.addContributors);
router.put("/students/remove-contributors", authenticateToken, authorizeStudent, projectController.removeContributors);

export default router;