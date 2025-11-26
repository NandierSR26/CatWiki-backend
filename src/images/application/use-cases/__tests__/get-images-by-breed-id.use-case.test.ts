import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetImagesByBreedIdUseCase } from '../get-images-by-breed-id.use-case.js';
import type { ImageRepository } from '../../../domain/repositories/image.repository.js';
import type { ImageProps } from '../../../domain/entities/image.entity.js';

describe('GetImagesByBreedIdUseCase', () => {
    let getImagesByBreedIdUseCase: GetImagesByBreedIdUseCase;
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

        getImagesByBreedIdUseCase = new GetImagesByBreedIdUseCase(mockImageRepository);
    });

    describe('execute', () => {
        it('should get images by breed id successfully', async () => {
            const breedId = 'abcd';
            const mockImages = [mockImage, { ...mockImage, id: 'image456' }];

            vi.mocked(mockImageRepository.getImagesByBreedId).mockResolvedValue(mockImages);

            const result = await getImagesByBreedIdUseCase.execute(breedId);

            expect(mockImageRepository.getImagesByBreedId).toHaveBeenCalledWith(breedId);
            expect(result).toEqual(mockImages);
            expect(result).toHaveLength(2);
        });

        it('should handle empty results', async () => {
            const breedId = 'nonexistent';

            vi.mocked(mockImageRepository.getImagesByBreedId).mockResolvedValue([]);

            const result = await getImagesByBreedIdUseCase.execute(breedId);

            expect(mockImageRepository.getImagesByBreedId).toHaveBeenCalledWith(breedId);
            expect(result).toEqual([]);
        });

        it('should throw error for empty breed id', async () => {
            await expect(getImagesByBreedIdUseCase.execute('')).rejects.toThrow('Breed ID is required and must be a string');
            expect(mockImageRepository.getImagesByBreedId).not.toHaveBeenCalled();
        });

        it('should throw error for non-string breed id', async () => {
            await expect(getImagesByBreedIdUseCase.execute(null as any)).rejects.toThrow('Breed ID is required and must be a string');
            await expect(getImagesByBreedIdUseCase.execute(123 as any)).rejects.toThrow('Breed ID is required and must be a string');
            expect(mockImageRepository.getImagesByBreedId).not.toHaveBeenCalled();
        });

        it('should handle repository errors', async () => {
            const breedId = 'abcd';
            const error = new Error('Repository error');

            vi.mocked(mockImageRepository.getImagesByBreedId).mockRejectedValue(error);

            await expect(getImagesByBreedIdUseCase.execute(breedId)).rejects.toThrow('Repository error');
            expect(mockImageRepository.getImagesByBreedId).toHaveBeenCalledWith(breedId);
        });
    });
});