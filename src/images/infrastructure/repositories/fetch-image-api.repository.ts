import type { ImageProps } from "../../domain/entities/image.entity.js";
import type { ImageRepository } from "../../domain/repositories/image.repository.js";

export class FetchImageAPIRepository implements ImageRepository {
    private readonly apiUrl: string;
    private readonly apiKey: string;
    
    constructor(apiUrl: string, apiKey: string) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    async getImagesByBreedId(breedId: string): Promise<ImageProps[]> {
        const response = await fetch(`${this.apiUrl}/images/search?breed_ids=${breedId}&limit=20`, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch images for breed ${breedId}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }

    async getImageByReferenceId(referenceImageId: string): Promise<ImageProps> {
        const response = await fetch(`${this.apiUrl}/images/${referenceImageId}`, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Image with reference ID ${referenceImageId} not found`);
            }
            throw new Error(`Failed to fetch image ${referenceImageId}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }
}