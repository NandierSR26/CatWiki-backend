import { AppRouter } from "./router.js"
import { Server } from "./server.js"
import { AppConfig } from "./config/app.config.js"

const server = new Server({
  port: Number.parseInt(AppConfig.PORT, 10),
  routes: AppRouter.routes
});

await server.start();