import type { CatRepository } from "../../domain/repositories/cat.repository.js";


export class GetBreedsUseCase {
    constructor(private readonly catRepository: CatRepository) {}

    async execute() {
        const cats = await this.catRepository.get();
        return cats;
    }
}