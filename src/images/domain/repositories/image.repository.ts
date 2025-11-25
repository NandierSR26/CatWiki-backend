import type { ImageProps } from "../entities/image.entity.js";

export interface ImageRepository {
    getImagesByBreedId(breedId: string): Promise<ImageProps[]>;
    getImageByReferenceId(referenceImageId: string): Promise<ImageProps>;
}