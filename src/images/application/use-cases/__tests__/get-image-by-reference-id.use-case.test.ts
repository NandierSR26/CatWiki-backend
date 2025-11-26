import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetImageByReferenceIdUseCase } from '../get-image-by-reference-id.use-case.js';
import type { ImageRepository } from '../../../domain/repositories/image.repository.js';
import type { ImageProps } from '../../../domain/entities/image.entity.js';

describe('GetImageByReferenceIdUseCase', () => {
    let getImageByReferenceIdUseCase: GetImageByReferenceIdUseCase;
    let mockImageRepository: ImageRepository;

    const mockImage: ImageProps = {
        id: 'image123',
        url: 'https://example.com/cat.jpg',
        width: 800,
        height: 600
    };

    beforeEach(() => {
        mockImageRepository = {
            getImagesByBreedId: vi.fn(),
            getImageByReferenceId: vi.fn(),
        };

        getImageByReferenceIdUseCase = new GetImageByReferenceIdUseCase(mockImageRepository);
    });

    describe('execute', () => {
        it('should get image by reference id successfully', async () => {
            const referenceId = 'image123';

            vi.mocked(mockImageRepository.getImageByReferenceId).mockResolvedValue(mockImage);

            const result = await getImageByReferenceIdUseCase.execute(referenceId);

            expect(mockImageRepository.getImageByReferenceId).toHaveBeenCalledWith(referenceId);
            expect(result).toEqual(mockImage);
            expect(result.id).toBe(referenceId);
        });

        it('should handle different reference ids', async () => {
            const referenceIds = ['image123', 'image456', 'image789'];

            for (const referenceId of referenceIds) {
                const mockImageWithId = { ...mockImage, id: referenceId };
                vi.mocked(mockImageRepository.getImageByReferenceId).mockResolvedValue(mockImageWithId);

                const result = await getImageByReferenceIdUseCase.execute(referenceId);

                expect(mockImageRepository.getImageByReferenceId).toHaveBeenCalledWith(referenceId);
                expect(result.id).toBe(referenceId);
            }
        });

        it('should throw error for empty reference id', async () => {
            await expect(getImageByReferenceIdUseCase.execute('')).rejects.toThrow('Reference image ID is required and must be a string');
            expect(mockImageRepository.getImageByReferenceId).not.toHaveBeenCalled();
        });

        it('should throw error for non-string reference id', async () => {
            await expect(getImageByReferenceIdUseCase.execute(null as any)).rejects.toThrow('Reference image ID is required and must be a string');
            await expect(getImageByReferenceIdUseCase.execute(undefined as any)).rejects.toThrow('Reference image ID is required and must be a string');
            expect(mockImageRepository.getImageByReferenceId).not.toHaveBeenCalled();
        });

        it('should handle repository errors', async () => {
            const referenceId = 'image123';
            const error = new Error('Image not found');

            vi.mocked(mockImageRepository.getImageByReferenceId).mockRejectedValue(error);

            await expect(getImageByReferenceIdUseCase.execute(referenceId)).rejects.toThrow('Image not found');
            expect(mockImageRepository.getImageByReferenceId).toHaveBeenCalledWith(referenceId);
        });
    });
});