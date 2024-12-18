import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorRef = uuidv4();

  console.log({ errorRef: errorRef, error: err });

  res.status(500).json({
    message: "Internal server error",
    errorRef: errorRef,
  });
};
