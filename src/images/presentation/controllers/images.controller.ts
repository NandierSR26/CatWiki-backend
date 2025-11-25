import type { Request, Response } from "express";
import type { GetImagesByBreedIdUseCase } from "../../application/use-cases/get-images-by-breed-id.use-case.js";
import type { GetImageByReferenceIdUseCase } from "../../application/use-cases/get-image-by-reference-id.use-case.js";

export class ImagesController {
    constructor(
        private readonly getImagesByBreedIdUseCase: GetImagesByBreedIdUseCase,
        private readonly getImageByReferenceIdUseCase: GetImageByReferenceIdUseCase
    ) {}

    getImagesByBreedId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { breedId } = req.params;
            
            if (!breedId) {
                res.status(400).json({ 
                    error: 'Breed ID is required',
                    message: 'Please provide a valid breed ID in the URL parameters'
                });
                return;
            }

            const images = await this.getImagesByBreedIdUseCase.execute(breedId);
            res.status(200).json(images);
        } catch (error) {
            console.error('Error getting images by breed ID:', error);
            if (error instanceof Error && error.message.includes('required')) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };

    getImageByReferenceId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { referenceImageId } = req.params;
            
            if (!referenceImageId) {
                res.status(400).json({ 
                    error: 'Reference image ID is required',
                    message: 'Please provide a valid reference image ID in the URL parameters'
                });
                return;
            }

            const image = await this.getImageByReferenceIdUseCase.execute(referenceImageId);
            res.status(200).json(image);
        } catch (error) {
            console.error('Error getting image by reference ID:', error);
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({ error: 'Image not found' });
                } else if (error.message.includes('required')) {
                    res.status(400).json({ error: error.message });
                } else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };
}