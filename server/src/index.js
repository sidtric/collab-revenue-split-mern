import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

const mongoEnabled = await connectDatabase();
const app = createApp(mongoEnabled);

app.listen(env.port, () => {
  logger.info("API running", {
    port: env.port,
    mongoEnabled,
  });
});
