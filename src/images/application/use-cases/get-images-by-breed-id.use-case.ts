import type { ImageRepository } from "../../domain/repositories/image.repository.js";

export class GetImagesByBreedIdUseCase {
    constructor(private readonly imageRepository: ImageRepository) {}

    async execute(breedId: string) {
        if (!breedId || typeof breedId !== 'string') {
            throw new Error('Breed ID is required and must be a string');
        }

        const images = await this.imageRepository.getImagesByBreedId(breedId);
        return images;
    }
}