import express from "express";
import { validateRequest } from "./middleware/requestValidation";
import {
  addNewTaskController,
  addNewTaskRequestSchema,
} from "./controllers/addNewTask";
import { healthController } from "./controllers/health";
import { authenticateRequest } from "./middleware/authentication";
import { getUserTasksController } from "./controllers/getUserTasks";

const router = express.Router();

// @ts-ignore
router.get("/health", healthController);

router.post(
  "/tasks",
  validateRequest(addNewTaskRequestSchema),
  authenticateRequest,
  // @ts-ignore
  addNewTaskController
);

router.get(
  "/tasks",
  authenticateRequest,
  // @ts-ignore
  getUserTasksController
);

export default router;
