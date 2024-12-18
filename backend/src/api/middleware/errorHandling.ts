import { RequestHandler } from "express";

export const validateRequest = <TParams, TQuery, TBody>(): RequestHandler<
  TParams,
  any,
  TBody,
  TQuery
> => {
  return (req, res, next) => {};
};
