import { describe, it, expect } from 'vitest';
import { CatEntity, type CatProps, type Weight, type Image } from '../cat.entity.js';

describe('CatEntity', () => {
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

    const mockCatProps: CatProps = {
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

    describe('constructor', () => {
        it('should create a cat entity with valid props', () => {
            const catEntity = new CatEntity(mockCatProps);

            expect(catEntity).toBeInstanceOf(CatEntity);
            expect(catEntity.getId()).toBe('abcd');
        });
    });

    describe('fromPrimitives', () => {
        it('should create cat entity from primitives', () => {
            const catEntity = CatEntity.fromPrimitives(mockCatProps);

            expect(catEntity).toBeInstanceOf(CatEntity);
            expect(catEntity.getId()).toBe(mockCatProps.id);
        });

        it('should handle cat with all properties', () => {
            const catEntity = CatEntity.fromPrimitives(mockCatProps);
            const primitives = catEntity.toPrimitives();

            expect(primitives.name).toBe('Abyssinian');
            expect(primitives.origin).toBe('Egypt');
            expect(primitives.temperament).toBe('Active, Energetic, Independent, Intelligent, Gentle');
            expect(primitives.weight).toEqual(mockWeight);
            expect(primitives.image).toEqual(mockImage);
        });
    });

    describe('toPrimitives', () => {
        it('should return correct primitives', () => {
            const catEntity = new CatEntity(mockCatProps);
            const primitives = catEntity.toPrimitives();

            expect(primitives).toEqual(mockCatProps);
            expect(primitives.id).toBe('abcd');
            expect(primitives.name).toBe('Abyssinian');
        });

        it('should preserve all nested objects', () => {
            const catEntity = new CatEntity(mockCatProps);
            const primitives = catEntity.toPrimitives();

            expect(primitives.weight).toEqual(mockWeight);
            expect(primitives.image).toEqual(mockImage);
            expect(primitives.weight.imperial).toBe('7 - 10');
            expect(primitives.image.url).toBe('https://example.com/cat.jpg');
        });
    });

    describe('getId', () => {
        it('should return correct cat id', () => {
            const catEntity = new CatEntity(mockCatProps);

            expect(catEntity.getId()).toBe('abcd');
        });

        it('should return different ids for different cats', () => {
            const cat1Props = { ...mockCatProps, id: 'cat1' };
            const cat2Props = { ...mockCatProps, id: 'cat2' };
            
            const cat1 = new CatEntity(cat1Props);
            const cat2 = new CatEntity(cat2Props);

            expect(cat1.getId()).toBe('cat1');
            expect(cat2.getId()).toBe('cat2');
            expect(cat1.getId()).not.toBe(cat2.getId());
        });
    });

    describe('data integrity', () => {
        it('should maintain breed characteristics', () => {
            const catEntity = new CatEntity(mockCatProps);
            const primitives = catEntity.toPrimitives();

            expect(primitives.adaptability).toBe(5);
            expect(primitives.affection_level).toBe(5);
            expect(primitives.energy_level).toBe(5);
            expect(primitives.intelligence).toBe(5);
            expect(primitives.life_span).toBe('14 - 15');
        });

        it('should handle boolean-like numeric values', () => {
            const catEntity = new CatEntity(mockCatProps);
            const primitives = catEntity.toPrimitives();

            expect(primitives.indoor).toBe(0);
            expect(primitives.hypoallergenic).toBe(0);
            expect(primitives.natural).toBe(1);
            expect(primitives.hairless).toBe(0);
        });
    });
});