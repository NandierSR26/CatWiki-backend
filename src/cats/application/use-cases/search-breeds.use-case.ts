import type { CatRepository } from "../../domain/repositories/cat.repository.js";

export class SearchBreedsUseCase {
    constructor(private readonly catRepository: CatRepository) {}

    async execute(query: string) {
        const cats = await this.catRepository.search(query);
        return cats;
    }
}