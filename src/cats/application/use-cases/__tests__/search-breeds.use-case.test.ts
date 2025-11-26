import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchBreedsUseCase } from '../search-breeds.use-case.js';
import type { CatRepository } from '../../../domain/repositories/cat.repository.js';
import type { CatProps, Weight, Image } from '../../../domain/entities/cat.entity.js';

describe('SearchBreedsUseCase', () => {
    let searchBreedsUseCase: SearchBreedsUseCase;
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

        searchBreedsUseCase = new SearchBreedsUseCase(mockCatRepository);
    });

    describe('execute', () => {
        it('should search breeds successfully', async () => {
            const query = 'Abyssinian';
            const mockCats = [mockCat];

            vi.mocked(mockCatRepository.search).mockResolvedValue(mockCats);

            const result = await searchBreedsUseCase.execute(query);

            expect(mockCatRepository.search).toHaveBeenCalledWith(query);
            expect(result).toEqual(mockCats);
            expect(result).toHaveLength(1);
            expect(result[0]?.name).toBe('Abyssinian');
        });

        it('should handle multiple search results', async () => {
            const query = 'active';
            const mockCats = [
                mockCat,
                { ...mockCat, id: 'beng', name: 'Bengal' },
                { ...mockCat, id: 'siam', name: 'Siamese' }
            ];

            vi.mocked(mockCatRepository.search).mockResolvedValue(mockCats);

            const result = await searchBreedsUseCase.execute(query);

            expect(mockCatRepository.search).toHaveBeenCalledWith(query);
            expect(result).toEqual(mockCats);
            expect(result).toHaveLength(3);
        });

        it('should handle empty search results', async () => {
            const query = 'NonExistentBreed';

            vi.mocked(mockCatRepository.search).mockResolvedValue([]);

            const result = await searchBreedsUseCase.execute(query);

            expect(mockCatRepository.search).toHaveBeenCalledWith(query);
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should handle different query types', async () => {
            const testQueries = [
                'temperament',
                'origin',
                'Egypt',
                'Active',
                'short hair',
                '14 - 15'
            ];

            vi.mocked(mockCatRepository.search).mockResolvedValue([mockCat]);

            for (const query of testQueries) {
                await searchBreedsUseCase.execute(query);
                expect(mockCatRepository.search).toHaveBeenCalledWith(query);
            }

            expect(mockCatRepository.search).toHaveBeenCalledTimes(6);
        });

        it('should handle empty string query', async () => {
            const emptyQuery = '';

            vi.mocked(mockCatRepository.search).mockResolvedValue([]);

            const result = await searchBreedsUseCase.execute(emptyQuery);

            expect(mockCatRepository.search).toHaveBeenCalledWith(emptyQuery);
            expect(result).toEqual([]);
        });

        it('should handle whitespace query', async () => {
            const whitespaceQuery = '   ';

            vi.mocked(mockCatRepository.search).mockResolvedValue([]);

            const result = await searchBreedsUseCase.execute(whitespaceQuery);

            expect(mockCatRepository.search).toHaveBeenCalledWith(whitespaceQuery);
            expect(result).toEqual([]);
        });

        it('should call repository with exact query parameter', async () => {
            const query = 'Test Query 123';
            
            vi.mocked(mockCatRepository.search).mockResolvedValue([mockCat]);

            await searchBreedsUseCase.execute(query);

            expect(mockCatRepository.search).toHaveBeenCalledWith(query);
            expect(mockCatRepository.search).toHaveBeenCalledTimes(1);
        });

        it('should handle repository errors', async () => {
            const query = 'test';
            const error = new Error('Search failed');
            
            vi.mocked(mockCatRepository.search).mockRejectedValue(error);

            await expect(searchBreedsUseCase.execute(query)).rejects.toThrow('Search failed');
            expect(mockCatRepository.search).toHaveBeenCalledWith(query);
        });
    });
});