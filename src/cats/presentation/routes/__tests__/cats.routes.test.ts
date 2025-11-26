import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Router } from 'express';
import { CatsRoutes } from '../cats.routes.js';
import type { CatsController } from '../../controllers/cats.controller.js';

// Mock Express Router
vi.mock('express', () => ({
    Router: vi.fn(() => ({
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    })),
}));

describe('CatsRoutes', () => {
    let mockCatsController: CatsController;
    let mockRouter: any;

    beforeEach(() => {
        mockCatsController = {
            getBreeds: vi.fn(),
            getBreedById: vi.fn(),
            searchBreeds: vi.fn(),
        } as any;

        mockRouter = {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        };

        vi.mocked(Router).mockReturnValue(mockRouter);
        vi.clearAllMocks();
    });

    describe('routes', () => {
        it('should create router with correct routes', () => {
            const router = CatsRoutes.routes(mockCatsController);

            expect(Router).toHaveBeenCalledTimes(1);
            expect(mockRouter.get).toHaveBeenCalledTimes(3);
            
            expect(mockRouter.get).toHaveBeenNthCalledWith(1, '/breeds', mockCatsController.getBreeds);
            expect(mockRouter.get).toHaveBeenNthCalledWith(2, '/breeds/:id', mockCatsController.getBreedById);
            expect(mockRouter.get).toHaveBeenNthCalledWith(3, '/search', mockCatsController.searchBreeds);
            
            expect(router).toBe(mockRouter);
        });

        it('should register all GET routes correctly', () => {
            CatsRoutes.routes(mockCatsController);

            const getCallsArgs = vi.mocked(mockRouter.get).mock.calls;
            
            // Verify the routes are registered with correct paths
            expect(getCallsArgs[0][0]).toBe('/breeds');
            expect(getCallsArgs[1][0]).toBe('/breeds/:id');
            expect(getCallsArgs[2][0]).toBe('/search');
            
            // Verify the routes are registered with correct controller methods
            expect(getCallsArgs[0][1]).toBe(mockCatsController.getBreeds);
            expect(getCallsArgs[1][1]).toBe(mockCatsController.getBreedById);
            expect(getCallsArgs[2][1]).toBe(mockCatsController.searchBreeds);
        });

        it('should not register any non-GET routes', () => {
            CatsRoutes.routes(mockCatsController);

            expect(mockRouter.post).not.toHaveBeenCalled();
            expect(mockRouter.put).not.toHaveBeenCalled();
            expect(mockRouter.delete).not.toHaveBeenCalled();
        });

        it('should return the same router instance', () => {
            const router1 = CatsRoutes.routes(mockCatsController);
            const router2 = CatsRoutes.routes(mockCatsController);

            // Both should be the same mock router (different calls but same return)
            expect(router1).toBe(mockRouter);
            expect(router2).toBe(mockRouter);
        });

        it('should work with different controller instances', () => {
            const anotherController = {
                getBreeds: vi.fn(),
                getBreedById: vi.fn(),
                searchBreeds: vi.fn(),
            } as any;

            const router = CatsRoutes.routes(anotherController);

            expect(mockRouter.get).toHaveBeenCalledWith('/breeds', anotherController.getBreeds);
            expect(mockRouter.get).toHaveBeenCalledWith('/breeds/:id', anotherController.getBreedById);
            expect(mockRouter.get).toHaveBeenCalledWith('/search', anotherController.searchBreeds);
            expect(router).toBe(mockRouter);
        });

        it('should maintain route order', () => {
            CatsRoutes.routes(mockCatsController);

            const calls = vi.mocked(mockRouter.get).mock.calls;
            
            // Verify the order of route registration
            expect(calls[0][0]).toBe('/breeds');      // First: general breeds route
            expect(calls[1][0]).toBe('/breeds/:id');  // Second: specific breed by id
            expect(calls[2][0]).toBe('/search');      // Third: search route
        });

        it('should handle controller methods as arrow functions', () => {
            const controllerWithArrowFunctions = {
                getBreeds: () => {},
                getBreedById: () => {},
                searchBreeds: () => {},
            } as any;

            const router = CatsRoutes.routes(controllerWithArrowFunctions);

            expect(mockRouter.get).toHaveBeenCalledWith('/breeds', controllerWithArrowFunctions.getBreeds);
            expect(mockRouter.get).toHaveBeenCalledWith('/breeds/:id', controllerWithArrowFunctions.getBreedById);
            expect(mockRouter.get).toHaveBeenCalledWith('/search', controllerWithArrowFunctions.searchBreeds);
            expect(router).toBe(mockRouter);
        });
    });

    describe('static method behavior', () => {
        it('should be a static method', () => {
            expect(typeof CatsRoutes.routes).toBe('function');
            expect(CatsRoutes.routes).toBe(CatsRoutes.routes);
        });

        it('should not require class instantiation', () => {
            // Should be able to call without creating an instance
            expect(() => {
                CatsRoutes.routes(mockCatsController);
            }).not.toThrow();
        });
    });
});