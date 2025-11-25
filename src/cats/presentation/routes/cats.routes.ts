import { Router } from "express";
import type { CatsController } from "../controllers/cats.controller.js";

export class CatsRoutes {
    static routes(
        catsController: CatsController
    ): Router {
        const router = Router();

        router.get('/breeds', catsController.getBreeds);
        router.get('/breeds/:id', catsController.getBreedById);
        router.get('/search', catsController.searchBreeds);
        return router;
    }
}