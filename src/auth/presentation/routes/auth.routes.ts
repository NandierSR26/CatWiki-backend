import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';

export class AuthRoutes {
  static routes(
    authController: AuthController,
    authMiddleware: AuthMiddleware
  ): Router {
    const router = Router();

    router.get('/check-auth', authMiddleware.authenticate, authController.checkAuthentication);

    // Rutas públicas
    router.post('/register', authController.register);
    router.post('/login', authController.login);

    // Rutas protegidas
    router.get('/profile', authMiddleware.authenticate, authController.getProfile);
    return router;
  }
}