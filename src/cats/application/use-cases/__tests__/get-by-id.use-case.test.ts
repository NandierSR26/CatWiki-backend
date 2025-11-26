import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetBreedByIdUseCase } from '../get-by-id.use-case.js';
import type { CatRepository } from '../../../domain/repositories/cat.repository.js';
import type { CatProps, Weight, Image } from '../../../domain/entities/cat.entity.js';

describe('GetBreedByIdUseCase', () => {
    let getBreedByIdUseCase: GetBreedByIdUseCase;
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

        getBreedByIdUseCase = new GetBreedByIdUseCase(mockCatRepository);
    });

    describe('execute', () => {
        it('should get breed by id successfully', async () => {
            const breedId = 'abcd';
            
            vi.mocked(mockCatRepository.getByBreedId).mockResolvedValue(mockCat);

            const result = await getBreedByIdUseCase.execute(breedId);

            expect(mockCatRepository.getByBreedId).toHaveBeenCalledWith(breedId);
            expect(result).toEqual(mockCat);
            expect(result.id).toBe(breedId);
        });

        it('should handle different breed ids', async () => {
            const testCases = [
                { id: 'beng', name: 'Bengal' },
                { id: 'pers', name: 'Persian' },
                { id: 'siam', name: 'Siamese' }
            ];

            for (const testCase of testCases) {
                const mockCatWithId = { ...mockCat, id: testCase.id, name: testCase.name };
                vi.mocked(mockCatRepository.getByBreedId).mockResolvedValue(mockCatWithId);

                const result = await getBreedByIdUseCase.execute(testCase.id);

                expect(mockCatRepository.getByBreedId).toHaveBeenCalledWith(testCase.id);
                expect(result.id).toBe(testCase.id);
                expect(result.name).toBe(testCase.name);
            }

            expect(mockCatRepository.getByBreedId).toHaveBeenCalledTimes(3);
        });

        it('should call repository with correct id parameter', async () => {
            const breedId = 'test-breed-id';
            
            vi.mocked(mockCatRepository.getByBreedId).mockResolvedValue(mockCat);

            await getBreedByIdUseCase.execute(breedId);

            expect(mockCatRepository.getByBreedId).toHaveBeenCalledWith(breedId);
            expect(mockCatRepository.getByBreedId).toHaveBeenCalledTimes(1);
        });

        it('should handle empty string id', async () => {
            const emptyId = '';
            
            vi.mocked(mockCatRepository.getByBreedId).mockResolvedValue(mockCat);

            await getBreedByIdUseCase.execute(emptyId);

            expect(mockCatRepository.getByBreedId).toHaveBeenCalledWith(emptyId);
        });

        it('should handle repository errors', async () => {
            const breedId = 'invalid-id';
            const error = new Error('Breed not found');
            
            vi.mocked(mockCatRepository.getByBreedId).mockRejectedValue(error);

            await expect(getBreedByIdUseCase.execute(breedId)).rejects.toThrow('Breed not found');
            expect(mockCatRepository.getByBreedId).toHaveBeenCalledWith(breedId);
        });

        it('should handle null/undefined repository response', async () => {
            const breedId = 'non-existent';
            
            vi.mocked(mockCatRepository.getByBreedId).mockResolvedValue(null as any);

            const result = await getBreedByIdUseCase.execute(breedId);

            expect(mockCatRepository.getByBreedId).toHaveBeenCalledWith(breedId);
            expect(result).toBeNull();
        });
    });
});