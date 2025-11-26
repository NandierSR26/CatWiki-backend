import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthMiddleware } from '../auth.middleware.js';
import type { JwtService } from '../../../application/interfaces/jwt.service.interface.js';

describe('AuthMiddleware', () => {
    let middleware: AuthMiddleware;
    let mockJwtService: JwtService;
    let mockRequest: any;
    let mockResponse: any;
    let mockNext: any;

    beforeEach(() => {
        mockJwtService = {
            generateToken: vi.fn(),
            verifyToken: vi.fn(),
        };

        middleware = new AuthMiddleware(mockJwtService);

        mockRequest = {
            headers: {},
            userId: undefined,
            userEmail: undefined,
        };

        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };

        mockNext = vi.fn();

        vi.clearAllMocks();
    });

    describe('authenticate', () => {
        it('should authenticate valid token successfully', async () => {
            const mockPayload = {
                userId: '507f1f77bcf86cd799439011',
                email: 'test@example.com'
            };

            mockRequest.headers.authorization = 'Bearer valid-jwt-token';
            vi.mocked(mockJwtService.verifyToken).mockResolvedValue(mockPayload);

            await middleware.authenticate(mockRequest, mockResponse, mockNext);

            expect(mockJwtService.verifyToken).toHaveBeenCalledWith('valid-jwt-token');
            expect(mockRequest.userId).toBe('507f1f77bcf86cd799439011');
            expect(mockRequest.userEmail).toBe('test@example.com');
            expect(mockNext).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should return 401 when authorization header is missing', async () => {
            mockRequest.headers = {}; // No authorization header

            await middleware.authenticate(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Access token is required'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 when authorization header does not start with Bearer', async () => {
            mockRequest.headers.authorization = 'Basic invalid-format';

            await middleware.authenticate(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Access token is required'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 when token is invalid', async () => {
            mockRequest.headers.authorization = 'Bearer invalid-token';
            vi.mocked(mockJwtService.verifyToken).mockRejectedValue(
                new Error('Invalid token')
            );

            await middleware.authenticate(mockRequest, mockResponse, mockNext);

            expect(mockJwtService.verifyToken).toHaveBeenCalledWith('invalid-token');
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                auth: false,
                message: 'Invalid or expired token'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should extract token correctly from Bearer header', async () => {
            const mockPayload = {
                userId: '507f1f77bcf86cd799439011',
                email: 'test@example.com'
            };

            mockRequest.headers.authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
            vi.mocked(mockJwtService.verifyToken).mockResolvedValue(mockPayload);

            await middleware.authenticate(mockRequest, mockResponse, mockNext);

            expect(mockJwtService.verifyToken).toHaveBeenCalledWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
            expect(mockNext).toHaveBeenCalled();
        });
    });
});