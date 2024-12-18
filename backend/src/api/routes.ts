import express from "express";
import { validateRequest } from "./middleware/requestValidation";
import {
  addNewTaskController,
  addNewTaskRequestSchema,
} from "./controllers/addNewTask";
import { healthController } from "./controllers/health";
import { authenticateRequest } from "./middleware/authentication";
import { getUserTasksController } from "./controllers/getUserTasks";
import { getTaskController, getTaskRequestSchema } from "./controllers/getTask";
import { errorHandler } from "./middleware/errorHandler";

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

router.get(
  "/tasks/:taskId",
  validateRequest(getTaskRequestSchema),
  authenticateRequest,
  // @ts-ignore
  getTaskController
);

// router.use(errorHandler);

export default router;
