import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CatsController } from '../cats.controller.js';
import type { GetBreedsUseCase } from '../../../application/use-cases/get-breeds.use-case.js';
import type { GetBreedByIdUseCase } from '../../../application/use-cases/get-by-id.use-case.js';
import type { SearchBreedsUseCase } from '../../../application/use-cases/search-breeds.use-case.js';
import type { CatProps, Weight, Image } from '../../../domain/entities/cat.entity.js';

describe('CatsController', () => {
    let catsController: CatsController;
    let mockGetBreedsUseCase: GetBreedsUseCase;
    let mockGetBreedByIdUseCase: GetBreedByIdUseCase;
    let mockSearchBreedsUseCase: SearchBreedsUseCase;
    let mockRequest: any;
    let mockResponse: any;

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
        mockGetBreedsUseCase = {
            execute: vi.fn(),
        } as any;

        mockGetBreedByIdUseCase = {
            execute: vi.fn(),
        } as any;

        mockSearchBreedsUseCase = {
            execute: vi.fn(),
        } as any;

        catsController = new CatsController(
            mockGetBreedsUseCase,
            mockGetBreedByIdUseCase,
            mockSearchBreedsUseCase
        );

        mockRequest = {
            query: {},
            params: {},
        };

        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };

        // Mock console.error to avoid noise in tests
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('getBreeds', () => {
        it('should get breeds with default pagination successfully', async () => {
            const mockCats = [mockCat, { ...mockCat, id: 'beng', name: 'Bengal' }];
            mockRequest.query = {};

            vi.mocked(mockGetBreedsUseCase.execute).mockResolvedValue(mockCats);

            await catsController.getBreeds(mockRequest, mockResponse);

            expect(mockGetBreedsUseCase.execute).toHaveBeenCalledWith(1, 10);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCats);
        });

        it('should get breeds with custom pagination parameters', async () => {
            const mockCats = [mockCat];
            mockRequest.query = { page: '2', limit: '5' };

            vi.mocked(mockGetBreedsUseCase.execute).mockResolvedValue(mockCats);

            await catsController.getBreeds(mockRequest, mockResponse);

            expect(mockGetBreedsUseCase.execute).toHaveBeenCalledWith(2, 5);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCats);
        });

        it('should handle string pagination parameters', async () => {
            const mockCats: CatProps[] = [];
            mockRequest.query = { page: '3', limit: '15' };

            vi.mocked(mockGetBreedsUseCase.execute).mockResolvedValue(mockCats);

            await catsController.getBreeds(mockRequest, mockResponse);

            expect(mockGetBreedsUseCase.execute).toHaveBeenCalledWith(3, 15);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCats);
        });

        it('should handle empty results', async () => {
            mockRequest.query = { page: '10', limit: '5' };

            vi.mocked(mockGetBreedsUseCase.execute).mockResolvedValue([]);

            await catsController.getBreeds(mockRequest, mockResponse);

            expect(mockGetBreedsUseCase.execute).toHaveBeenCalledWith(10, 5);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith([]);
        });

        it('should handle use case errors', async () => {
            const error = new Error('Database error');
            mockRequest.query = { page: '1', limit: '10' };

            vi.mocked(mockGetBreedsUseCase.execute).mockRejectedValue(error);

            await catsController.getBreeds(mockRequest, mockResponse);

            expect(mockGetBreedsUseCase.execute).toHaveBeenCalledWith(1, 10);
            expect(console.error).toHaveBeenCalledWith('Error getting breeds:', error);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });

        it('should handle invalid pagination parameters', async () => {
            const mockCats = [mockCat];
            mockRequest.query = { page: 'invalid', limit: 'also-invalid' };

            vi.mocked(mockGetBreedsUseCase.execute).mockResolvedValue(mockCats);

            await catsController.getBreeds(mockRequest, mockResponse);

            expect(mockGetBreedsUseCase.execute).toHaveBeenCalledWith(Number.NaN, Number.NaN);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCats);
        });
    });

    describe('getBreedById', () => {
        it('should get breed by id successfully', async () => {
            const breedId = 'abcd';
            mockRequest.params = { id: breedId };

            vi.mocked(mockGetBreedByIdUseCase.execute).mockResolvedValue(mockCat);

            await catsController.getBreedById(mockRequest, mockResponse);

            expect(mockGetBreedByIdUseCase.execute).toHaveBeenCalledWith(breedId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCat);
        });

        it('should handle different breed ids', async () => {
            const testCases = ['beng', 'pers', 'siam'];

            for (const breedId of testCases) {
                const mockCatWithId = { ...mockCat, id: breedId };
                mockRequest.params = { id: breedId };

                vi.mocked(mockGetBreedByIdUseCase.execute).mockResolvedValue(mockCatWithId);

                await catsController.getBreedById(mockRequest, mockResponse);

                expect(mockGetBreedByIdUseCase.execute).toHaveBeenCalledWith(breedId);
                expect(mockResponse.status).toHaveBeenCalledWith(200);
                expect(mockResponse.json).toHaveBeenCalledWith(mockCatWithId);
            }
        });

        it('should handle breed not found error', async () => {
            const breedId = 'nonexistent';
            const error = new Error('Breed not found');
            mockRequest.params = { id: breedId };

            vi.mocked(mockGetBreedByIdUseCase.execute).mockRejectedValue(error);

            await catsController.getBreedById(mockRequest, mockResponse);

            expect(mockGetBreedByIdUseCase.execute).toHaveBeenCalledWith(breedId);
            expect(console.error).toHaveBeenCalledWith('Error getting breed by id:', error);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Breed not found' });
        });

        it('should handle general use case errors', async () => {
            const breedId = 'abcd';
            const error = new Error('Database connection failed');
            mockRequest.params = { id: breedId };

            vi.mocked(mockGetBreedByIdUseCase.execute).mockRejectedValue(error);

            await catsController.getBreedById(mockRequest, mockResponse);

            expect(mockGetBreedByIdUseCase.execute).toHaveBeenCalledWith(breedId);
            expect(console.error).toHaveBeenCalledWith('Error getting breed by id:', error);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });

        it('should handle empty breed id', async () => {
            const breedId = '';
            mockRequest.params = { id: breedId };

            vi.mocked(mockGetBreedByIdUseCase.execute).mockResolvedValue(mockCat);

            await catsController.getBreedById(mockRequest, mockResponse);

            expect(mockGetBreedByIdUseCase.execute).toHaveBeenCalledWith(breedId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCat);
        });

        it('should handle undefined breed id', async () => {
            mockRequest.params = {};

            vi.mocked(mockGetBreedByIdUseCase.execute).mockResolvedValue(mockCat);

            await catsController.getBreedById(mockRequest, mockResponse);

            expect(mockGetBreedByIdUseCase.execute).toHaveBeenCalledWith(undefined);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCat);
        });
    });

    describe('searchBreeds', () => {
        it('should search breeds successfully', async () => {
            const query = 'Abyssinian';
            const mockCats = [mockCat];
            mockRequest.query = { query };

            vi.mocked(mockSearchBreedsUseCase.execute).mockResolvedValue(mockCats);

            await catsController.searchBreeds(mockRequest, mockResponse);

            expect(mockSearchBreedsUseCase.execute).toHaveBeenCalledWith(query);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCats);
        });

        it('should handle multiple search results', async () => {
            const query = 'active';
            const mockCats = [
                mockCat,
                { ...mockCat, id: 'beng', name: 'Bengal' },
                { ...mockCat, id: 'siam', name: 'Siamese' }
            ];
            mockRequest.query = { query };

            vi.mocked(mockSearchBreedsUseCase.execute).mockResolvedValue(mockCats);

            await catsController.searchBreeds(mockRequest, mockResponse);

            expect(mockSearchBreedsUseCase.execute).toHaveBeenCalledWith(query);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCats);
            expect(mockCats).toHaveLength(3);
        });

        it('should handle empty search results', async () => {
            const query = 'nonexistent';
            mockRequest.query = { query };

            vi.mocked(mockSearchBreedsUseCase.execute).mockResolvedValue([]);

            await catsController.searchBreeds(mockRequest, mockResponse);

            expect(mockSearchBreedsUseCase.execute).toHaveBeenCalledWith(query);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith([]);
        });

        it('should handle empty query', async () => {
            const query = '';
            mockRequest.query = { query };

            vi.mocked(mockSearchBreedsUseCase.execute).mockResolvedValue([]);

            await catsController.searchBreeds(mockRequest, mockResponse);

            expect(mockSearchBreedsUseCase.execute).toHaveBeenCalledWith(query);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith([]);
        });

        it('should handle undefined query', async () => {
            mockRequest.query = {};

            vi.mocked(mockSearchBreedsUseCase.execute).mockResolvedValue([]);

            await catsController.searchBreeds(mockRequest, mockResponse);

            expect(mockSearchBreedsUseCase.execute).toHaveBeenCalledWith(undefined);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith([]);
        });

        it('should handle search use case errors', async () => {
            const query = 'test';
            const error = new Error('Search service unavailable');
            mockRequest.query = { query };

            vi.mocked(mockSearchBreedsUseCase.execute).mockRejectedValue(error);

            await catsController.searchBreeds(mockRequest, mockResponse);

            expect(mockSearchBreedsUseCase.execute).toHaveBeenCalledWith(query);
            expect(console.error).toHaveBeenCalledWith('Error searching breeds:', error);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });

        it('should handle special characters in query', async () => {
            const query = 'test with spaces & symbols';
            const mockCats = [mockCat];
            mockRequest.query = { query };

            vi.mocked(mockSearchBreedsUseCase.execute).mockResolvedValue(mockCats);

            await catsController.searchBreeds(mockRequest, mockResponse);

            expect(mockSearchBreedsUseCase.execute).toHaveBeenCalledWith(query);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCats);
        });
    });
});