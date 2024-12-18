import { Response } from "express";

export const healthController = (
  request: Request,
  response: Response
): void => {
  response.status(200).send("OK");
};
