import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImagesController } from '../images.controller.js';
import type { GetImagesByBreedIdUseCase } from '../../../application/use-cases/get-images-by-breed-id.use-case.js';
import type { GetImageByReferenceIdUseCase } from '../../../application/use-cases/get-image-by-reference-id.use-case.js';
import type { ImageProps } from '../../../domain/entities/image.entity.js';

describe('ImagesController', () => {
    let imagesController: ImagesController;
    let mockGetImagesByBreedIdUseCase: GetImagesByBreedIdUseCase;
    let mockGetImageByReferenceIdUseCase: GetImageByReferenceIdUseCase;
    let mockRequest: any;
    let mockResponse: any;

    const mockImage: ImageProps = {
        id: 'image123',
        url: 'https://example.com/cat.jpg',
        width: 800,
        height: 600
    };

    beforeEach(() => {
        mockGetImagesByBreedIdUseCase = {
            execute: vi.fn(),
        } as any;

        mockGetImageByReferenceIdUseCase = {
            execute: vi.fn(),
        } as any;

        imagesController = new ImagesController(
            mockGetImagesByBreedIdUseCase,
            mockGetImageByReferenceIdUseCase
        );

        mockRequest = {
            params: {},
        };

        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };

        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('getImagesByBreedId', () => {
        it('should get images by breed id successfully', async () => {
            const breedId = 'abcd';
            const mockImages = [mockImage, { ...mockImage, id: 'image456' }];
            mockRequest.params = { breedId };

            vi.mocked(mockGetImagesByBreedIdUseCase.execute).mockResolvedValue(mockImages);

            await imagesController.getImagesByBreedId(mockRequest, mockResponse);

            expect(mockGetImagesByBreedIdUseCase.execute).toHaveBeenCalledWith(breedId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockImages);
        });

        it('should return 400 when breed id is missing', async () => {
            mockRequest.params = {};

            await imagesController.getImagesByBreedId(mockRequest, mockResponse);

            expect(mockGetImagesByBreedIdUseCase.execute).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Breed ID is required',
                message: 'Please provide a valid breed ID in the URL parameters'
            });
        });

        it('should handle use case errors', async () => {
            const breedId = 'abcd';
            const error = new Error('Database error');
            mockRequest.params = { breedId };

            vi.mocked(mockGetImagesByBreedIdUseCase.execute).mockRejectedValue(error);

            await imagesController.getImagesByBreedId(mockRequest, mockResponse);

            expect(console.error).toHaveBeenCalledWith('Error getting images by breed ID:', error);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

    describe('getImageByReferenceId', () => {
        it('should get image by reference id successfully', async () => {
            const referenceImageId = 'image123';
            mockRequest.params = { referenceImageId };

            vi.mocked(mockGetImageByReferenceIdUseCase.execute).mockResolvedValue(mockImage);

            await imagesController.getImageByReferenceId(mockRequest, mockResponse);

            expect(mockGetImageByReferenceIdUseCase.execute).toHaveBeenCalledWith(referenceImageId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockImage);
        });

        it('should return 400 when reference id is missing', async () => {
            mockRequest.params = {};

            await imagesController.getImageByReferenceId(mockRequest, mockResponse);

            expect(mockGetImageByReferenceIdUseCase.execute).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Reference image ID is required',
                message: 'Please provide a valid reference image ID in the URL parameters'
            });
        });

        it('should handle not found errors', async () => {
            const referenceImageId = 'nonexistent';
            const error = new Error('Image not found');
            mockRequest.params = { referenceImageId };

            vi.mocked(mockGetImageByReferenceIdUseCase.execute).mockRejectedValue(error);

            await imagesController.getImageByReferenceId(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Image not found' });
        });
    });
});