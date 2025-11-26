import { describe, it, expect, vi } from 'vitest';
import { AuthRoutes } from '../auth.routes.js';

describe('AuthRoutes', () => {
    const mockAuthController = {
        register: vi.fn(),
        login: vi.fn(),
        getProfile: vi.fn(),
        checkAuthentication: vi.fn(),
    } as any;

    const mockAuthMiddleware = {
        authenticate: vi.fn(),
    } as any;

    describe('routes', () => {
        it('should return a router with configured routes', () => {
            const router = AuthRoutes.routes(mockAuthController, mockAuthMiddleware);

            expect(router).toBeDefined();
            expect(typeof router).toBe('function'); // Express Router is a function
        });

        it('should be callable with controller and middleware parameters', () => {
            expect(() => {
                AuthRoutes.routes(mockAuthController, mockAuthMiddleware);
            }).not.toThrow();
        });

        it('should create routes method as static method', () => {
            expect(typeof AuthRoutes.routes).toBe('function');
            expect(AuthRoutes.routes).toBeDefined();
        });
    });
});