import express, { Router } from "express";
import { DatabaseConfig } from "./config/database.config.js";
import { AppConfig } from "./config/app.config.js";

interface ServerOptions {
  port: number;
  routes: Router;
}

export class Server {
  public app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly routes: Router;

  constructor(serveOptions: ServerOptions) {
    const { port, routes } = serveOptions;
    this.port = port;
    this.routes = routes;
  }

  async start() {
    // Validate configuration
    AppConfig.validate();

    // CORS
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );

      if (req.method === "OPTIONS") {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // Connect to database
    await DatabaseConfig.connect(AppConfig.MONGO_URI);

    // Middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Routes
    this.app.use(this.routes);

    // Global error handler
    this.app.use((err: any, req: any, res: any, next: any) => {
      console.error("Global error handler:", err);
      res.status(500).json({ error: "Internal server error" });
    });

    // Start server
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  public async close() {
    this.serverListener?.close();
    await DatabaseConfig.disconnect();
  }
}
