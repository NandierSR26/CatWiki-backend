import type { CatRepository } from "../../domain/repositories/cat.repository.js";


export class GetBreedByIdUseCase {
    constructor(private readonly catRepository: CatRepository) {}

    async execute(id: string) {
        const cat = await this.catRepository.getByBreedId(id);
        return cat;
    }
}