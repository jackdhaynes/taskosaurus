import { z, ZodSchema, ZodType } from "zod";
import { Request, RequestHandler } from "express";

export type RequestSchema<TParams, TQuery, TBody> = {
  params?: ZodSchema<TParams>;
  query?: ZodSchema<TQuery>;
  body?: ZodSchema<TBody>;
};

export type ValidatedRequest<TSchema> = TSchema extends RequestSchema<
  infer TParams,
  infer TQuery,
  infer TBody
>
  ? Request<
      z.infer<ZodType<TParams>>,
      any,
      z.infer<ZodType<TBody>>,
      z.infer<ZodType<TQuery>>
    >
  : Request<any>;

export const validateRequest = <TParams, TQuery, TBody>(
  schema: RequestSchema<TParams, TQuery, TBody>
): RequestHandler<TParams, any, TBody, TQuery> => {
  return (req, res, next) => {
    try {
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }

      if (schema.body) {
        req.body = schema.body.parse(req.body);

        return next();
      }
    } catch (error) {
      res.status(400).send({ message: "Invalid input", details: error });
    }
  };
};
