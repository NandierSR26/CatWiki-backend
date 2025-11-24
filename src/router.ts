import { Router } from "express";
import { AuthModuleFactory } from './shared/infrastructure/auth-module.factory.js';

export class AppRouter {
  static get routes(): Router {
    const router = Router();
    
    const authModule = AuthModuleFactory.create();

    // Health check
    router.get('/api/v1/health', (req, res) => {
        res.send({ status: 'ok' });
    });

    // Auth routes
    router.use('/api/v1/auth', authModule.authRoutes);
    return router;
  }
}