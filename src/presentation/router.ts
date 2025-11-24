import { Router } from "express";

export class AppRouter {
  static get routes(): Router {
    const router = Router();    

    router.use('/api/v1/health', (req, res) => {
        res.send({ status: 'ok' });
    });

    return router;
  }
}