import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetBreedsUseCase } from '../get-breeds.use-case.js';
import type { CatRepository } from '../../../domain/repositories/cat.repository.js';
import type { CatProps, Weight, Image } from '../../../domain/entities/cat.entity.js';

describe('GetBreedsUseCase', () => {
    let getBreedsUseCase: GetBreedsUseCase;
    let mockCatRepository: CatRepository;

    const mockWeight: Weight = {
        imperial: '7 - 10',
        metric: '3 - 5'
    };

    const mockImage: Image = {
        id: 'image123',
        width: 800,
        height: 600,
        url: 'https://example.com/cat.jpg'
    };

    const mockCat: CatProps = {
        weight: mockWeight,
        id: 'abcd',
        name: 'Abyssinian',
        cfa_url: 'http://cfa.org/Breeds/BreedsAB/Abyssinian.aspx',
        vetstreet_url: 'http://www.vetstreet.com/cats/abyssinian',
        vcahospitals_url: 'https://vcahospitals.com/know-your-pet/cat-breeds/abyssinian',
        temperament: 'Active, Energetic, Independent, Intelligent, Gentle',
        origin: 'Egypt',
        country_codes: 'EG',
        country_code: 'EG',
        description: 'The Abyssinian is easy to care for, and a joy to have in your home.',
        life_span: '14 - 15',
        indoor: 0,
        alt_names: '',
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
        wikipedia_url: 'https://en.wikipedia.org/wiki/Abyssinian_cat',
        hypoallergenic: 0,
        reference_image_id: 'image123',
        image: mockImage
    };

    beforeEach(() => {
        mockCatRepository = {
            get: vi.fn(),
            search: vi.fn(),
            getByBreedId: vi.fn(),
        };

        getBreedsUseCase = new GetBreedsUseCase(mockCatRepository);
    });

    describe('execute', () => {
        it('should get breeds with pagination', async () => {
            const page = 1;
            const limit = 10;
            const mockCats = [mockCat, { ...mockCat, id: 'beng', name: 'Bengal' }];

            vi.mocked(mockCatRepository.get).mockResolvedValue(mockCats);

            const result = await getBreedsUseCase.execute(page, limit);

            expect(mockCatRepository.get).toHaveBeenCalledWith(page, limit);
            expect(result).toEqual(mockCats);
            expect(result).toHaveLength(2);
        });

        it('should handle different pagination parameters', async () => {
            const page = 2;
            const limit = 5;
            const mockCats = [mockCat];

            vi.mocked(mockCatRepository.get).mockResolvedValue(mockCats);

            const result = await getBreedsUseCase.execute(page, limit);

            expect(mockCatRepository.get).toHaveBeenCalledWith(page, limit);
            expect(result).toEqual(mockCats);
            expect(result).toHaveLength(1);
        });

        it('should return empty array when no breeds found', async () => {
            const page = 1;
            const limit = 10;

            vi.mocked(mockCatRepository.get).mockResolvedValue([]);

            const result = await getBreedsUseCase.execute(page, limit);

            expect(mockCatRepository.get).toHaveBeenCalledWith(page, limit);
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should call repository with correct parameters', async () => {
            const testCases = [
                { page: 0, limit: 5 },
                { page: 3, limit: 20 },
                { page: 1, limit: 1 }
            ];

            vi.mocked(mockCatRepository.get).mockResolvedValue([]);

            for (const { page, limit } of testCases) {
                await getBreedsUseCase.execute(page, limit);
                expect(mockCatRepository.get).toHaveBeenCalledWith(page, limit);
            }

            expect(mockCatRepository.get).toHaveBeenCalledTimes(3);
        });

        it('should handle repository errors', async () => {
            const error = new Error('Repository error');
            vi.mocked(mockCatRepository.get).mockRejectedValue(error);

            await expect(getBreedsUseCase.execute(1, 10)).rejects.toThrow('Repository error');
            expect(mockCatRepository.get).toHaveBeenCalledWith(1, 10);
        });
    });
});