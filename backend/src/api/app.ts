import express, { Express, Request, Response } from "express";

export const createApp = (port: number): Express => {
  const app: Express = express();

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello world!");
  });

  return app;
};
