import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FetchAPIRepository } from '../fetch-api.repsitory.js';
import type { CatProps, Weight, Image } from '../../../domain/entities/cat.entity.js';

// Mock global fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('FetchAPIRepository', () => {
    let fetchAPIRepository: FetchAPIRepository;
    const mockApiUrl = 'https://api.thecatapi.com/v1';
    const mockApiKey = 'test-api-key';

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

    const createMockResponse = (data: any, ok = true, status = 200) => ({
        ok,
        status,
        json: vi.fn().mockResolvedValue(data),
    });

    beforeEach(() => {
        fetchAPIRepository = new FetchAPIRepository(mockApiUrl, mockApiKey);
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('should create instance with correct properties', () => {
            const repository = new FetchAPIRepository(mockApiUrl, mockApiKey);
            expect(repository).toBeInstanceOf(FetchAPIRepository);
        });

        it('should handle different API URLs and keys', () => {
            const customUrl = 'https://custom-api.com';
            const customKey = 'custom-key';
            const repository = new FetchAPIRepository(customUrl, customKey);
            expect(repository).toBeInstanceOf(FetchAPIRepository);
        });
    });

    describe('get', () => {
        it('should fetch breeds with pagination successfully', async () => {
            const page = 1;
            const limit = 10;
            const mockCats = [mockCat, { ...mockCat, id: 'beng', name: 'Bengal' }];

            mockFetch.mockResolvedValue(createMockResponse(mockCats));

            const result = await fetchAPIRepository.get(page, limit);

            expect(mockFetch).toHaveBeenCalledWith(
                `${mockApiUrl}/breeds?page=${page}&limit=${limit}`,
                {
                    headers: {
                        'x-api-key': mockApiKey
                    }
                }
            );
            expect(result).toEqual(mockCats);
            expect(result).toHaveLength(2);
        });

        it('should handle different pagination parameters', async () => {
            const page = 3;
            const limit = 5;
            const mockCats = [mockCat];

            mockFetch.mockResolvedValue(createMockResponse(mockCats));

            const result = await fetchAPIRepository.get(page, limit);

            expect(mockFetch).toHaveBeenCalledWith(
                `${mockApiUrl}/breeds?page=${page}&limit=${limit}`,
                expect.objectContaining({
                    headers: { 'x-api-key': mockApiKey }
                })
            );
            expect(result).toEqual(mockCats);
        });

        it('should handle empty results', async () => {
            const page = 1;
            const limit = 10;

            mockFetch.mockResolvedValue(createMockResponse([]));

            const result = await fetchAPIRepository.get(page, limit);

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should throw error when response is not ok', async () => {
            const page = 1;
            const limit = 10;

            mockFetch.mockResolvedValue(createMockResponse({}, false, 500));

            await expect(fetchAPIRepository.get(page, limit)).rejects.toThrow('Failed to fetch breeds');
            expect(mockFetch).toHaveBeenCalledWith(
                `${mockApiUrl}/breeds?page=${page}&limit=${limit}`,
                expect.objectContaining({
                    headers: { 'x-api-key': mockApiKey }
                })
            );
        });

        it('should handle network errors', async () => {
            const page = 1;
            const limit = 10;

            mockFetch.mockRejectedValue(new Error('Network error'));

            await expect(fetchAPIRepository.get(page, limit)).rejects.toThrow('Network error');
        });
    });

    describe('search', () => {
        it('should search breeds successfully', async () => {
            const query = 'Abyssinian';
            const mockCats = [mockCat];

            mockFetch.mockResolvedValue(createMockResponse(mockCats));

            const result = await fetchAPIRepository.search(query);

            expect(mockFetch).toHaveBeenCalledWith(
                `${mockApiUrl}/breeds/search?q=${query}`,
                {
                    headers: {
                        'x-api-key': mockApiKey
                    }
                }
            );
            expect(result).toEqual(mockCats);
            expect(result[0]?.name).toBe('Abyssinian');
        });

        it('should handle multiple search results', async () => {
            const query = 'active';
            const mockCats = [
                mockCat,
                { ...mockCat, id: 'beng', name: 'Bengal' },
                { ...mockCat, id: 'siam', name: 'Siamese' }
            ];

            mockFetch.mockResolvedValue(createMockResponse(mockCats));

            const result = await fetchAPIRepository.search(query);

            expect(mockFetch).toHaveBeenCalledWith(
                `${mockApiUrl}/breeds/search?q=${query}`,
                expect.objectContaining({
                    headers: { 'x-api-key': mockApiKey }
                })
            );
            expect(result).toEqual(mockCats);
            expect(result).toHaveLength(3);
        });

        it('should handle empty search results', async () => {
            const query = 'nonexistent';

            mockFetch.mockResolvedValue(createMockResponse([]));

            const result = await fetchAPIRepository.search(query);

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should handle special characters in query', async () => {
            const query = 'test with spaces & symbols';
            
            mockFetch.mockResolvedValue(createMockResponse([]));

            await fetchAPIRepository.search(query);

            expect(mockFetch).toHaveBeenCalledWith(
                `${mockApiUrl}/breeds/search?q=${query}`,
                expect.objectContaining({
                    headers: { 'x-api-key': mockApiKey }
                })
            );
        });

        it('should throw error when search fails', async () => {
            const query = 'test';

            mockFetch.mockResolvedValue(createMockResponse({}, false, 400));

            await expect(fetchAPIRepository.search(query)).rejects.toThrow('Failed to search breeds');
        });

        it('should handle network errors during search', async () => {
            const query = 'test';

            mockFetch.mockRejectedValue(new Error('Network timeout'));

            await expect(fetchAPIRepository.search(query)).rejects.toThrow('Network timeout');
        });
    });

    describe('getByBreedId', () => {
        it('should get breed by id successfully', async () => {
            const breedId = 'abcd';

            mockFetch.mockResolvedValue(createMockResponse(mockCat));

            const result = await fetchAPIRepository.getByBreedId(breedId);

            expect(mockFetch).toHaveBeenCalledWith(
                `${mockApiUrl}/breeds/${breedId}`,
                {
                    headers: {
                        'x-api-key': mockApiKey
                    }
                }
            );
            expect(result).toEqual(mockCat);
            expect(result.id).toBe(breedId);
        });

        it('should handle different breed ids', async () => {
            const testCases = ['beng', 'pers', 'siam'];

            for (const breedId of testCases) {
                const mockCatWithId = { ...mockCat, id: breedId };
                mockFetch.mockResolvedValue(createMockResponse(mockCatWithId));

                const result = await fetchAPIRepository.getByBreedId(breedId);

                expect(mockFetch).toHaveBeenCalledWith(
                    `${mockApiUrl}/breeds/${breedId}`,
                    expect.objectContaining({
                        headers: { 'x-api-key': mockApiKey }
                    })
                );
                expect(result.id).toBe(breedId);
            }
        });

        it('should throw error when breed not found', async () => {
            const breedId = 'nonexistent';

            mockFetch.mockResolvedValue(createMockResponse({}, false, 404));

            await expect(fetchAPIRepository.getByBreedId(breedId)).rejects.toThrow('Failed to fetch breed by ID');
        });

        it('should handle empty breed id', async () => {
            const breedId = '';

            mockFetch.mockResolvedValue(createMockResponse(mockCat));

            await fetchAPIRepository.getByBreedId(breedId);

            expect(mockFetch).toHaveBeenCalledWith(
                `${mockApiUrl}/breeds/`,
                expect.objectContaining({
                    headers: { 'x-api-key': mockApiKey }
                })
            );
        });

        it('should handle network errors', async () => {
            const breedId = 'abcd';

            mockFetch.mockRejectedValue(new Error('Connection refused'));

            await expect(fetchAPIRepository.getByBreedId(breedId)).rejects.toThrow('Connection refused');
        });
    });

    describe('Get (generic method)', () => {
        it('should fetch data from custom endpoint successfully', async () => {
            const endpoint = 'categories';
            const mockData = [{ id: 1, name: 'Hats' }, { id: 2, name: 'Boxes' }];

            mockFetch.mockResolvedValue(createMockResponse(mockData));

            const result = await fetchAPIRepository.Get(endpoint);

            expect(mockFetch).toHaveBeenCalledWith(
                `${mockApiUrl}/${endpoint}`,
                {
                    headers: {
                        'x-api-key': mockApiKey
                    }
                }
            );
            expect(result).toEqual(mockData);
        });

        it('should handle different endpoints', async () => {
            const testEndpoints = ['images', 'votes', 'favourites'];
            const mockData = { success: true };

            for (const endpoint of testEndpoints) {
                mockFetch.mockResolvedValue(createMockResponse(mockData));

                const result = await fetchAPIRepository.Get(endpoint);

                expect(mockFetch).toHaveBeenCalledWith(
                    `${mockApiUrl}/${endpoint}`,
                    expect.objectContaining({
                        headers: { 'x-api-key': mockApiKey }
                    })
                );
                expect(result).toEqual(mockData);
            }
        });

        it('should throw error with endpoint name when request fails', async () => {
            const endpoint = 'invalid-endpoint';

            mockFetch.mockResolvedValue(createMockResponse({}, false, 404));

            await expect(fetchAPIRepository.Get(endpoint)).rejects.toThrow(`Failed to fetch data from ${endpoint}`);
        });

        it('should handle endpoint with parameters', async () => {
            const endpoint = 'images/search?limit=10&breed_id=abys';
            const mockData = [mockImage];

            mockFetch.mockResolvedValue(createMockResponse(mockData));

            const result = await fetchAPIRepository.Get(endpoint);

            expect(mockFetch).toHaveBeenCalledWith(
                `${mockApiUrl}/${endpoint}`,
                expect.objectContaining({
                    headers: { 'x-api-key': mockApiKey }
                })
            );
            expect(result).toEqual(mockData);
        });

        it('should handle network errors with custom endpoint', async () => {
            const endpoint = 'test-endpoint';

            mockFetch.mockRejectedValue(new Error('DNS resolution failed'));

            await expect(fetchAPIRepository.Get(endpoint)).rejects.toThrow('DNS resolution failed');
        });
    });
});