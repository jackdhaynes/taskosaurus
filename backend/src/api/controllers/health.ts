import { ValidatedRequest } from "../middleware/requestValidation";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authentication";

type HealthRequest = AuthenticatedRequest;

export const healthController = (
  request: HealthRequest,
  response: Response
): void => {
  response.status(200).send(`OK ${request.userId}`);
};
