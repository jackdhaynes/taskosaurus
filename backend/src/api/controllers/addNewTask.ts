import { addNewTaskInteractor } from "@/application/interactors/addNewTask";
import { Response } from "express";
import { z } from "zod";
import { ValidatedRequest } from "../middleware/requestValidation";
import { AuthenticatedRequest } from "../middleware/authentication";

export const addNewTaskRequestSchema = {
  body: z.object({
    description: z.string().min(1).max(100),
  }),
  params: z.object({}),
  query: z.object({}),
};

type AddNewTaskRequest = ValidatedRequest<typeof addNewTaskRequestSchema> &
  AuthenticatedRequest;

export const addNewTaskController = (
  request: AddNewTaskRequest,
  response: Response
) => {
  addNewTaskInteractor(123, request.body.description).then((task) => {
    response.status(200).json(task);
    request;
  });
};
