import { GetImagesByBreedIdUseCase } from "../../images/application/use-cases/get-images-by-breed-id.use-case.js";
import { GetImageByReferenceIdUseCase } from "../../images/application/use-cases/get-image-by-reference-id.use-case.js";
import { FetchImageAPIRepository } from "../../images/infrastructure/repositories/fetch-image-api.repository.js";
import { ImagesController } from "../../images/presentation/controllers/images.controller.js";
import { ImagesRoutes } from "../../images/presentation/routes/images.routes.js";
import { AppConfig } from "./dependency-container.js";

export class ImagesModuleFactory {
    static create() {
        // Infrastructure
        const imagesRepository = new FetchImageAPIRepository(
            AppConfig.CAT_API_BASE_URL, 
            AppConfig.CAT_API_KEY
        );

        // Application
        const getImagesByBreedIdUseCase = new GetImagesByBreedIdUseCase(imagesRepository);
        const getImageByReferenceIdUseCase = new GetImageByReferenceIdUseCase(imagesRepository);

        // Presentation
        const imagesController = new ImagesController(
            getImagesByBreedIdUseCase,
            getImageByReferenceIdUseCase
        );
        const imagesRouter = ImagesRoutes.routes(imagesController);

        return {
            imagesRouter,
            imagesRepository,
            getImagesByBreedIdUseCase,
            getImageByReferenceIdUseCase
        };
    }
}