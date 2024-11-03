import { env } from "process";
import { createApp } from "./api/app";

const port = Number(env.API_PORT) || 3000;

const app = createApp(port);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
