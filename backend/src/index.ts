import { env } from "process";
import { createServer } from "@/api/app";

const port = Number(env.API_PORT) || 3000;

const server = createServer(port);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
