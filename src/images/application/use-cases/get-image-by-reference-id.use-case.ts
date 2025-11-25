import type { ImageRepository } from "../../domain/repositories/image.repository.js";

export class GetImageByReferenceIdUseCase {
    constructor(private readonly imageRepository: ImageRepository) {}

    async execute(referenceImageId: string) {
        if (!referenceImageId || typeof referenceImageId !== 'string') {
            throw new Error('Reference image ID is required and must be a string');
        }

        const image = await this.imageRepository.getImageByReferenceId(referenceImageId);
        return image;
    }
}