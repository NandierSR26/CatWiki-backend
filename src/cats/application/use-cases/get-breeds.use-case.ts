import type { CatRepository } from "../../domain/repositories/cat.repository.js";


export class GetBreedsUseCase {
    constructor(
        private readonly catRepository: CatRepository
    ) {}

    async execute(page: number, limit: number) {
        const cats = await this.catRepository.get(page, limit);
        return cats;
    }
}