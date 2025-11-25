import { Router } from "express";
import type { ImagesController } from "../controllers/images.controller.js";

export class ImagesRoutes {
    static routes(imagesController: ImagesController): Router {
        const router = Router();

        // GET /images/breed/:breedId - Obtener imágenes por ID de raza
        router.get('/breed/:breedId', imagesController.getImagesByBreedId);
        
        // GET /images/reference/:referenceImageId - Obtener imagen por reference_image_id
        router.get('/reference/:referenceImageId', imagesController.getImageByReferenceId);

        return router;
    }
}