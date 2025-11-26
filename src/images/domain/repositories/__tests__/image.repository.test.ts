import { describe, it, expect, vi } from 'vitest';
import type { ImageRepository } from '../image.repository.js';
import type { ImageProps, ImageBreed } from '../../entities/image.entity.js';

describe('ImageRepository Interface', () => {
    const createMockRepository = (): ImageRepository => ({
        getImagesByBreedId: vi.fn(),
        getImageByReferenceId: vi.fn(),
    });

    const mockBreed: ImageBreed = {
        weight: {
            imperial: '7 - 10',
            metric: '3 - 5'
        },
        id: 'abcd',
        name: 'Abyssinian',
        temperament: 'Active, Energetic, Independent',
        origin: 'Egypt',
        country_codes: 'EG',
        country_code: 'EG',
        description: 'The Abyssinian is easy to care for.',
        life_span: '14 - 15',
        indoor: 0,
        adaptability: 5,
        affection_level: 5,
        child_friendly: 3,
        dog_friendly: 4,
        energy_level: 5,
        grooming: 1,
        health_issues: 2,
        intelligence: 5,
        shedding_level: 2,
        social_needs: 5,
        stranger_friendly: 5,
        vocalisation: 1,
        experimental: 0,
        hairless: 0,
        natural: 1,
        rare: 0,
        rex: 0,
        suppressed_tail: 0,
        short_legs: 0,
        hypoallergenic: 0,
        reference_image_id: 'image123'
    };

    const mockImage: ImageProps = {
        id: 'image123',
        url: 'https://example.com/cat.jpg',
        width: 800,
        height: 600,
        breeds: [mockBreed]
    };

    describe('getImagesByBreedId', () => {
        it('should get images by breed id', async () => {
            const mockRepository = createMockRepository();
            const breedId = 'abcd';
            const mockImages = [mockImage, { ...mockImage, id: 'image456' }];

            vi.mocked(mockRepository.getImagesByBreedId).mockResolvedValue(mockImages);

            const result = await mockRepository.getImagesByBreedId(breedId);

            expect(mockRepository.getImagesByBreedId).toHaveBeenCalledWith(breedId);
            expect(result).toEqual(mockImages);
            expect(result).toHaveLength(2);
        });

        it('should handle empty results', async () => {
            const mockRepository = createMockRepository();
            const breedId = 'nonexistent';

            vi.mocked(mockRepository.getImagesByBreedId).mockResolvedValue([]);

            const result = await mockRepository.getImagesByBreedId(breedId);

            expect(mockRepository.getImagesByBreedId).toHaveBeenCalledWith(breedId);
            expect(result).toEqual([]);
        });

        it('should handle different breed ids', async () => {
            const mockRepository = createMockRepository();
            const breedIds = ['abcd', 'beng', 'pers'];

            for (const breedId of breedIds) {
                vi.mocked(mockRepository.getImagesByBreedId).mockResolvedValue([mockImage]);
                
                const result = await mockRepository.getImagesByBreedId(breedId);
                expect(mockRepository.getImagesByBreedId).toHaveBeenCalledWith(breedId);
                expect(result).toEqual([mockImage]);
            }

            expect(mockRepository.getImagesByBreedId).toHaveBeenCalledTimes(3);
        });
    });

    describe('getImageByReferenceId', () => {
        it('should get image by reference id', async () => {
            const mockRepository = createMockRepository();
            const referenceId = 'image123';

            vi.mocked(mockRepository.getImageByReferenceId).mockResolvedValue(mockImage);

            const result = await mockRepository.getImageByReferenceId(referenceId);

            expect(mockRepository.getImageByReferenceId).toHaveBeenCalledWith(referenceId);
            expect(result).toEqual(mockImage);
            expect(result.id).toBe(referenceId);
        });

        it('should handle different reference ids', async () => {
            const mockRepository = createMockRepository();
            const referenceIds = ['image123', 'image456', 'image789'];

            for (const referenceId of referenceIds) {
                const mockImageWithId = { ...mockImage, id: referenceId };
                vi.mocked(mockRepository.getImageByReferenceId).mockResolvedValue(mockImageWithId);
                
                const result = await mockRepository.getImageByReferenceId(referenceId);
                expect(mockRepository.getImageByReferenceId).toHaveBeenCalledWith(referenceId);
                expect(result.id).toBe(referenceId);
            }

            expect(mockRepository.getImageByReferenceId).toHaveBeenCalledTimes(3);
        });

        it('should work with single image response', async () => {
            const mockRepository = createMockRepository();
            const referenceId = 'single-image';

            vi.mocked(mockRepository.getImageByReferenceId).mockResolvedValue(mockImage);

            const result = await mockRepository.getImageByReferenceId(referenceId);

            expect(mockRepository.getImageByReferenceId).toHaveBeenCalledWith(referenceId);
            expect(result).toEqual(mockImage);
        });
    });
});