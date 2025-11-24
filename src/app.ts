import { AppRouter } from "./presentation/router.js"
import { Server } from "./presentation/server.js"

const server = new Server({
  port: 3000,
  routes: AppRouter.routes
})
await server.start();