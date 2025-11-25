import { GetBreedsUseCase } from "../../cats/application/use-cases/get-breeds.use-case.js";
import { GetBreedByIdUseCase } from "../../cats/application/use-cases/get-by-id.use-case.js";
import { SearchBreedsUseCase } from "../../cats/application/use-cases/search-breeds.use-case.js";
import { FetchAPIRepository } from "../../cats/infrastructure/repositories/fetch-api.repsitory.js";
import { CatsController } from "../../cats/presentation/controllers/cats.controller.js";
import { CatsRoutes } from "../../cats/presentation/routes/cats.routes.js";
import { AppConfig } from "./dependency-container.js";


export class CatsModuleFactory {
    static create() {
        // Infrastructure
        const catsRepository = new FetchAPIRepository(
            AppConfig.CAT_API_BASE_URL, AppConfig.CAT_API_KEY
        )

        // Application
        const getBreedsUseCase = new GetBreedsUseCase(catsRepository);
        const getBreedByIdUseCase = new GetBreedByIdUseCase(catsRepository);
        const searchBreedsUseCase = new SearchBreedsUseCase(catsRepository);

        // Presentation
        const catsController = new CatsController(
            getBreedsUseCase,
            getBreedByIdUseCase,
            searchBreedsUseCase
        );
        const catsRouter = CatsRoutes.routes(catsController);

        return {
            catsRouter,
            catsRepository
        };
    }
}