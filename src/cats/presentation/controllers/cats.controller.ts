import type { GetBreedsUseCase } from "../../application/use-cases/get-breeds.use-case.js";
import type { GetBreedByIdUseCase } from "../../application/use-cases/get-by-id.use-case.js";
import type { SearchBreedsUseCase } from "../../application/use-cases/search-breeds.use-case.js";


export class CatsController {
    constructor(
        private readonly getBreedsUseCase: GetBreedsUseCase,
        private readonly getBreedByIdUseCase: GetBreedByIdUseCase,
        private readonly searchBreedsUseCase: SearchBreedsUseCase
    ) {}

    getBreeds = async (req: any, res: any): Promise<void> => {
        try {
            const breeds = await this.getBreedsUseCase.execute();
            res.status(200).json(breeds);
        } catch (error) {
            console.error('Error getting breeds:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    getBreedById = async (req: any, res: any): Promise<void> => {
        try {
            const { id } = req.params;
            const breed = await this.getBreedByIdUseCase.execute(id);
            res.status(200).json(breed);
        } catch (error) {
            console.error('Error getting breed by id:', error);
            if (error instanceof Error && error.message.includes('not found')) {
                res.status(404).json({ error: 'Breed not found' });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };

    searchBreeds = async (req: any, res: any): Promise<void> => {
        try {
            const { query } = req.query;
            const breeds = await this.searchBreedsUseCase.execute(query);
            res.status(200).json(breeds);
        } catch (error) {
            console.error('Error searching breeds:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}