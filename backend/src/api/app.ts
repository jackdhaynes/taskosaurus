import express, { Express } from "express";
import router from "./routes";
import { env } from "process";

export const createServer = (port: number): Express => {
  const server: Express = express();

  server.use(express.json());
  server.use("/", router);

  return server;
};
