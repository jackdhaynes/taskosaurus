import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authentication";
import { getUserTasksInteractor } from "@/application/interactors/getUserTasks";
import { z } from "zod";
import { ValidatedRequest } from "../middleware/requestValidation";
import {
  getTaskInteractor,
  TaskNotFoundError,
} from "@/application/interactors/getTask";

export const getTaskRequestSchema = {
  body: z.object({}),
  params: z.object({
    taskId: z.coerce.number(),
  }),
  query: z.object({}),
};

type GetTaskRequest = ValidatedRequest<typeof getTaskRequestSchema> &
  AuthenticatedRequest;

export const getTaskController = async (
  request: GetTaskRequest,
  response: Response
) => {
  try {
    var task = await getTaskInteractor(
      request.userIdentity,
      request.params.taskId
    );
  } catch (error) {
    if (error instanceof TaskNotFoundError) {
      return response.status(204).send();
    }
    throw error;
  }

  return response.status(200).json({
    task: task,
  });
};
