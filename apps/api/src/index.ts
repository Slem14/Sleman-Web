import { buildServer } from "./server.js";
import { loadConfig } from "./config.js";

const config = loadConfig();
const app = await buildServer(config);

// Graceful shutdown: stop accepting connections, let in-flight requests
// finish. Critical later so document processing always reaches its cleanup
// path (master-spec §16) even during deploys.
const SHUTDOWN_SIGNALS = ["SIGINT", "SIGTERM"] as const;
for (const signal of SHUTDOWN_SIGNALS) {
  process.once(signal, () => {
    app.log.info({ signal }, "shutting down");
    void app
      .close()
      .then(() => process.exit(0))
      .catch((err: unknown) => {
        app.log.error(err, "error during shutdown");
        process.exit(1);
      });
  });
}

try {
  await app.listen({ port: config.port, host: config.host });
} catch (err) {
  app.log.error(err, "failed to start");
  process.exit(1);
}
