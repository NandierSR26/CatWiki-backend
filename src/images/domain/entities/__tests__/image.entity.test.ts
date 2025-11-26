import { describe, it, expect } from 'vitest';
import { ImageEntity, type ImageProps, type ImageBreed } from '../image.entity.js';

describe('ImageEntity', () => {
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

    const mockImageProps: ImageProps = {
        id: 'image123',
        url: 'https://example.com/cat.jpg',
        width: 800,
        height: 600,
        breeds: [mockBreed]
    };

    const mockImageWithoutBreeds: ImageProps = {
        id: 'image456',
        url: 'https://example.com/cat2.jpg',
        width: 1024,
        height: 768
    };

    describe('constructor', () => {
        it('should create ImageEntity instance', () => {
            const imageEntity = new ImageEntity(mockImageProps);
            expect(imageEntity).toBeInstanceOf(ImageEntity);
        });
    });

    describe('fromPrimitives', () => {
        it('should create ImageEntity from primitives', () => {
            const imageEntity = ImageEntity.fromPrimitives(mockImageProps);
            expect(imageEntity).toBeInstanceOf(ImageEntity);
            expect(imageEntity.getId()).toBe(mockImageProps.id);
        });

        it('should handle image without breeds', () => {
            const imageEntity = ImageEntity.fromPrimitives(mockImageWithoutBreeds);
            expect(imageEntity).toBeInstanceOf(ImageEntity);
            expect(imageEntity.getId()).toBe(mockImageWithoutBreeds.id);
        });
    });

    describe('toPrimitives', () => {
        it('should return original image properties', () => {
            const imageEntity = new ImageEntity(mockImageProps);
            const result = imageEntity.toPrimitives();
            expect(result).toEqual(mockImageProps);
        });

        it('should return image without breeds when not present', () => {
            const imageEntity = new ImageEntity(mockImageWithoutBreeds);
            const result = imageEntity.toPrimitives();
            expect(result).toEqual(mockImageWithoutBreeds);
        });
    });

    describe('getId', () => {
        it('should return correct image id', () => {
            const imageEntity = new ImageEntity(mockImageProps);
            expect(imageEntity.getId()).toBe('image123');
        });

        it('should return different ids for different images', () => {
            const imageEntity1 = new ImageEntity(mockImageProps);
            const imageEntity2 = new ImageEntity(mockImageWithoutBreeds);
            
            expect(imageEntity1.getId()).toBe('image123');
            expect(imageEntity2.getId()).toBe('image456');
            expect(imageEntity1.getId()).not.toBe(imageEntity2.getId());
        });
    });

    describe('getUrl', () => {
        it('should return correct image url', () => {
            const imageEntity = new ImageEntity(mockImageProps);
            expect(imageEntity.getUrl()).toBe('https://example.com/cat.jpg');
        });

        it('should return different urls for different images', () => {
            const imageEntity1 = new ImageEntity(mockImageProps);
            const imageEntity2 = new ImageEntity(mockImageWithoutBreeds);
            
            expect(imageEntity1.getUrl()).toBe('https://example.com/cat.jpg');
            expect(imageEntity2.getUrl()).toBe('https://example.com/cat2.jpg');
        });
    });

    describe('getBreeds', () => {
        it('should return breeds when present', () => {
            const imageEntity = new ImageEntity(mockImageProps);
            const breeds = imageEntity.getBreeds();
            
            expect(breeds).toEqual([mockBreed]);
            expect(breeds).toHaveLength(1);
            expect(breeds[0]?.name).toBe('Abyssinian');
        });

        it('should return empty array when breeds not present', () => {
            const imageEntity = new ImageEntity(mockImageWithoutBreeds);
            const breeds = imageEntity.getBreeds();
            
            expect(breeds).toEqual([]);
            expect(breeds).toHaveLength(0);
        });
    });

    describe('hasBreeds', () => {
        it('should return true when breeds are present', () => {
            const imageEntity = new ImageEntity(mockImageProps);
            expect(imageEntity.hasBreeds()).toBe(true);
        });

        it('should return false when breeds are not present', () => {
            const imageEntity = new ImageEntity(mockImageWithoutBreeds);
            expect(imageEntity.hasBreeds()).toBe(false);
        });

        it('should return false when breeds array is empty', () => {
            const imageWithEmptyBreeds = { ...mockImageProps, breeds: [] };
            const imageEntity = new ImageEntity(imageWithEmptyBreeds);
            expect(imageEntity.hasBreeds()).toBe(false);
        });
    });
});