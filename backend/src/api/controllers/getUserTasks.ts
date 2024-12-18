import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authentication";
import { getUserTasksInteractor } from "@/application/interactors/getUserTasks";

export const getUserTasksController = async (
  request: AuthenticatedRequest,
  response: Response
) => {
  const tasks = await getUserTasksInteractor(request.userIdentity.userId);

  return response.status(200).json({
    tasks: tasks,
  });
};
