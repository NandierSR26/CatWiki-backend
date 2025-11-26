import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Router } from 'express';
import { ImagesRoutes } from '../images.routes.js';
import type { ImagesController } from '../../controllers/images.controller.js';

vi.mock('express', () => ({
    Router: vi.fn(() => ({
        get: vi.fn(),
    })),
}));

describe('ImagesRoutes', () => {
    let mockImagesController: ImagesController;
    let mockRouter: any;

    beforeEach(() => {
        mockImagesController = {
            getImagesByBreedId: vi.fn(),
            getImageByReferenceId: vi.fn(),
        } as any;

        mockRouter = {
            get: vi.fn(),
        };

        vi.mocked(Router).mockReturnValue(mockRouter);
        vi.clearAllMocks();
    });

    describe('routes', () => {
        it('should create router with correct routes', () => {
            const router = ImagesRoutes.routes(mockImagesController);

            expect(Router).toHaveBeenCalledTimes(1);
            expect(mockRouter.get).toHaveBeenCalledTimes(2);
            
            expect(mockRouter.get).toHaveBeenNthCalledWith(1, '/breed/:breedId', mockImagesController.getImagesByBreedId);
            expect(mockRouter.get).toHaveBeenNthCalledWith(2, '/reference/:referenceImageId', mockImagesController.getImageByReferenceId);
            
            expect(router).toBe(mockRouter);
        });

        it('should register routes with correct paths and methods', () => {
            ImagesRoutes.routes(mockImagesController);

            const getCallsArgs = vi.mocked(mockRouter.get).mock.calls;
            
            expect(getCallsArgs[0][0]).toBe('/breed/:breedId');
            expect(getCallsArgs[1][0]).toBe('/reference/:referenceImageId');
            
            expect(getCallsArgs[0][1]).toBe(mockImagesController.getImagesByBreedId);
            expect(getCallsArgs[1][1]).toBe(mockImagesController.getImageByReferenceId);
        });

        it('should return the router instance', () => {
            const router = ImagesRoutes.routes(mockImagesController);
            expect(router).toBe(mockRouter);
        });
    });
});