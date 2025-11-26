import { describe, it, expect, vi } from 'vitest';
import type { CatRepository } from '../cat.repository.js';
import type { CatProps, Weight, Image } from '../../entities/cat.entity.js';

describe('CatRepository Interface', () => {
    const createMockRepository = (): CatRepository => ({
        get: vi.fn(),
        search: vi.fn(),
        getByBreedId: vi.fn(),
    });

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

    describe('get', () => {
        it('should get paginated cats', async () => {
            const mockRepository = createMockRepository();
            const mockCats = [mockCat, { ...mockCat, id: 'efgh', name: 'Bengal' }];
            const page = 1;
            const limit = 10;

            vi.mocked(mockRepository.get).mockResolvedValue(mockCats);

            const result = await mockRepository.get(page, limit);

            expect(mockRepository.get).toHaveBeenCalledWith(page, limit);
            expect(result).toEqual(mockCats);
            expect(result).toHaveLength(2);
        });

        it('should handle different pagination parameters', async () => {
            const mockRepository = createMockRepository();
            const page = 2;
            const limit = 5;

            vi.mocked(mockRepository.get).mockResolvedValue([mockCat]);

            const result = await mockRepository.get(page, limit);

            expect(mockRepository.get).toHaveBeenCalledWith(2, 5);
            expect(result).toEqual([mockCat]);
        });

        it('should return empty array when no cats found', async () => {
            const mockRepository = createMockRepository();

            vi.mocked(mockRepository.get).mockResolvedValue([]);

            const result = await mockRepository.get(1, 10);

            expect(mockRepository.get).toHaveBeenCalledWith(1, 10);
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });
    });

    describe('search', () => {
        it('should search cats by query', async () => {
            const mockRepository = createMockRepository();
            const query = 'Abyssinian';
            const mockCats = [mockCat];

            vi.mocked(mockRepository.search).mockResolvedValue(mockCats);

            const result = await mockRepository.search(query);

            expect(mockRepository.search).toHaveBeenCalledWith(query);
            expect(result).toEqual(mockCats);
            expect(result[0]?.name).toBe('Abyssinian');
        });

        it('should handle empty search results', async () => {
            const mockRepository = createMockRepository();
            const query = 'NonexistentBreed';

            vi.mocked(mockRepository.search).mockResolvedValue([]);

            const result = await mockRepository.search(query);

            expect(mockRepository.search).toHaveBeenCalledWith(query);
            expect(result).toEqual([]);
        });

        it('should search with different query types', async () => {
            const mockRepository = createMockRepository();

            vi.mocked(mockRepository.search).mockResolvedValue([mockCat]);

            await mockRepository.search('temperament');
            await mockRepository.search('origin');
            await mockRepository.search('Egypt');

            expect(mockRepository.search).toHaveBeenCalledTimes(3);
            expect(mockRepository.search).toHaveBeenNthCalledWith(1, 'temperament');
            expect(mockRepository.search).toHaveBeenNthCalledWith(2, 'origin');
            expect(mockRepository.search).toHaveBeenNthCalledWith(3, 'Egypt');
        });
    });

    describe('getByBreedId', () => {
        it('should get cat by breed id', async () => {
            const mockRepository = createMockRepository();
            const breedId = 'abcd';

            vi.mocked(mockRepository.getByBreedId).mockResolvedValue(mockCat);

            const result = await mockRepository.getByBreedId(breedId);

            expect(mockRepository.getByBreedId).toHaveBeenCalledWith(breedId);
            expect(result).toEqual(mockCat);
            expect(result.id).toBe(breedId);
        });

        it('should handle different breed ids', async () => {
            const mockRepository = createMockRepository();
            const bengalCat = { ...mockCat, id: 'beng', name: 'Bengal' };

            vi.mocked(mockRepository.getByBreedId).mockResolvedValue(bengalCat);

            const result = await mockRepository.getByBreedId('beng');

            expect(mockRepository.getByBreedId).toHaveBeenCalledWith('beng');
            expect(result.id).toBe('beng');
            expect(result.name).toBe('Bengal');
        });

        it('should work with breed id as parameter', async () => {
            const mockRepository = createMockRepository();
            const breedIds = ['abcd', 'beng', 'pers'];

            for (const breedId of breedIds) {
                vi.mocked(mockRepository.getByBreedId).mockResolvedValue({
                    ...mockCat,
                    id: breedId
                });
                
                const result = await mockRepository.getByBreedId(breedId);
                expect(result.id).toBe(breedId);
            }

            expect(mockRepository.getByBreedId).toHaveBeenCalledTimes(3);
        });
    });
});