import 'dotenv/config';
import { createApp } from './app.js';
import { createRuntime } from './composition/create-runtime.js';
import { loadConfig } from './config/env.js';

const config = loadConfig();
const runtime = createRuntime(config);
const app = createApp({ trustProxy: config.trustProxy, ...runtime.appDependencies });
const server = app.listen(config.port, () => {
  console.info(`Backend listening on port ${config.port}`);
});

let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.info(`Received ${signal}; shutting down`);

  server.close(async () => {
    await runtime.close();
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
