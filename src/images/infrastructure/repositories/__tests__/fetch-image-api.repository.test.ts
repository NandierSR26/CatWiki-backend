import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FetchImageAPIRepository } from '../fetch-image-api.repository.js';
import type { ImageProps } from '../../../domain/entities/image.entity.js';

// Mock global fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('FetchImageAPIRepository', () => {
    let fetchImageAPIRepository: FetchImageAPIRepository;
    const mockApiUrl = 'https://api.thecatapi.com/v1';
    const mockApiKey = 'test-api-key';

    const mockImage: ImageProps = {
        id: 'image123',
        url: 'https://example.com/cat.jpg',
        width: 800,
        height: 600
    };

    const createMockResponse = (data: any, ok = true, status = 200) => ({
        ok,
        status,
        statusText: ok ? 'OK' : 'Error',
        json: vi.fn().mockResolvedValue(data),
    });

    beforeEach(() => {
        fetchImageAPIRepository = new FetchImageAPIRepository(mockApiUrl, mockApiKey);
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('should create instance with correct properties', () => {
            const repository = new FetchImageAPIRepository(mockApiUrl, mockApiKey);
            expect(repository).toBeInstanceOf(FetchImageAPIRepository);
        });
    });

    describe('getImagesByBreedId', () => {
        it('should fetch images by breed id successfully', async () => {
            const breedId = 'abcd';
            const mockImages = [mockImage, { ...mockImage, id: 'image456' }];

            mockFetch.mockResolvedValue(createMockResponse(mockImages));

            const result = await fetchImageAPIRepository.getImagesByBreedId(breedId);

            expect(mockFetch).toHaveBeenCalledWith(
                `${mockApiUrl}/images/search?breed_ids=${breedId}&limit=20`,
                {
                    headers: {
                        'x-api-key': mockApiKey
                    }
                }
            );
            expect(result).toEqual(mockImages);
            expect(result).toHaveLength(2);
        });

        it('should handle empty results', async () => {
            const breedId = 'nonexistent';

            mockFetch.mockResolvedValue(createMockResponse([]));

            const result = await fetchImageAPIRepository.getImagesByBreedId(breedId);

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should throw error when response is not ok', async () => {
            const breedId = 'abcd';

            mockFetch.mockResolvedValue(createMockResponse({}, false, 500));

            await expect(fetchImageAPIRepository.getImagesByBreedId(breedId)).rejects.toThrow(`Failed to fetch images for breed ${breedId}: Error`);
        });

        it('should handle network errors', async () => {
            const breedId = 'abcd';

            mockFetch.mockRejectedValue(new Error('Network error'));

            await expect(fetchImageAPIRepository.getImagesByBreedId(breedId)).rejects.toThrow('Network error');
        });
    });

    describe('getImageByReferenceId', () => {
        it('should get image by reference id successfully', async () => {
            const referenceId = 'image123';

            mockFetch.mockResolvedValue(createMockResponse(mockImage));

            const result = await fetchImageAPIRepository.getImageByReferenceId(referenceId);

            expect(mockFetch).toHaveBeenCalledWith(
                `${mockApiUrl}/images/${referenceId}`,
                {
                    headers: {
                        'x-api-key': mockApiKey
                    }
                }
            );
            expect(result).toEqual(mockImage);
        });

        it('should handle 404 errors with specific message', async () => {
            const referenceId = 'nonexistent';

            mockFetch.mockResolvedValue(createMockResponse({}, false, 404));

            await expect(fetchImageAPIRepository.getImageByReferenceId(referenceId)).rejects.toThrow(`Image with reference ID ${referenceId} not found`);
        });

        it('should handle other HTTP errors', async () => {
            const referenceId = 'image123';

            mockFetch.mockResolvedValue(createMockResponse({}, false, 500));

            await expect(fetchImageAPIRepository.getImageByReferenceId(referenceId)).rejects.toThrow(`Failed to fetch image ${referenceId}: Error`);
        });

        it('should handle network errors', async () => {
            const referenceId = 'image123';

            mockFetch.mockRejectedValue(new Error('Connection timeout'));

            await expect(fetchImageAPIRepository.getImageByReferenceId(referenceId)).rejects.toThrow('Connection timeout');
        });
    });
});