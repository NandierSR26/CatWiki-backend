import express, { Router } from "express";

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
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(this.routes);

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}