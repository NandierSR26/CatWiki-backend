import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthController } from '../auth.controller.js';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case.js';
import { LoginUserUseCase } from '../../../application/use-cases/login-user.use-case.js';
import { GetUserByIdUseCase } from '../../../application/use-cases/get-user-by-id.use-case.js';
import { CheckAuthenticationUseCase } from '../../../application/use-cases/check-authentication.use-case.js';
import { User } from '../../../domain/entities/user.entity.js';
import { UserAlreadyExistsError } from '../../../domain/errors/user-already-exists.error.js';
import { InvalidCredentialsError } from '../../../domain/errors/invalid-credentials.error.js';

describe('AuthController', () => {
    let controller: AuthController;
    let mockRegisterUseCase: RegisterUserUseCase;
    let mockLoginUseCase: LoginUserUseCase;
    let mockGetUserByIdUseCase: GetUserByIdUseCase;
    let mockCheckAuthUseCase: CheckAuthenticationUseCase;
    let mockRequest: any;
    let mockResponse: any;

    beforeEach(() => {
        mockRegisterUseCase = {
            execute: vi.fn(),
        } as any;

        mockLoginUseCase = {
            execute: vi.fn(),
        } as any;

        mockGetUserByIdUseCase = {
            execute: vi.fn(),
        } as any;

        mockCheckAuthUseCase = {
            execute: vi.fn(),
        } as any;

        controller = new AuthController(
            mockRegisterUseCase,
            mockLoginUseCase,
            mockGetUserByIdUseCase,
            mockCheckAuthUseCase
        );

        mockRequest = {
            body: {},
            params: {},
            userId: undefined,
        };

        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };

        vi.clearAllMocks();
    });

    describe('register', () => {
        it('should register user successfully', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'Password123!',
                name: 'Test User'
            };
            mockRequest.body = userData;

            const mockUser = User.fromPrimitives({
                id: '507f1f77bcf86cd799439011',
                ...userData,
                password: 'HashedPassword123!',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            vi.mocked(mockRegisterUseCase.execute).mockResolvedValue(mockUser);

            await controller.register(mockRequest, mockResponse);

            expect(mockRegisterUseCase.execute).toHaveBeenCalledWith(userData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'User registered successfully, sign in to continue',
                user: {
                    id: '507f1f77bcf86cd799439011',
                    email: 'test@example.com',
                    name: 'Test User'
                }
            });
        });

        it('should return 400 when required fields are missing', async () => {
            mockRequest.body = { email: 'test@example.com' }; // missing password and name

            await controller.register(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Email, password and name are required'
            });
        });

        it('should handle UserAlreadyExistsError', async () => {
            mockRequest.body = {
                email: 'existing@example.com',
                password: 'Password123!',
                name: 'Test User'
            };

            vi.mocked(mockRegisterUseCase.execute).mockRejectedValue(
                new UserAlreadyExistsError('existing@example.com')
            );

            await controller.register(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(409);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'User with email existing@example.com already exists'
            });
        });
    });

    describe('login', () => {
        it('should login user successfully', async () => {
            const credentials = {
                email: 'test@example.com',
                password: 'Password123!'
            };
            mockRequest.body = credentials;

            const mockAuthResponse = {
                token: 'jwt-token',
                user: {
                    id: '507f1f77bcf86cd799439011',
                    email: 'test@example.com',
                    name: 'Test User'
                }
            };

            vi.mocked(mockLoginUseCase.execute).mockResolvedValue(mockAuthResponse);

            await controller.login(mockRequest, mockResponse);

            expect(mockLoginUseCase.execute).toHaveBeenCalledWith(credentials);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Login successful',
                data: mockAuthResponse
            });
        });

        it('should return 400 when credentials are missing', async () => {
            mockRequest.body = { email: 'test@example.com' }; // missing password

            await controller.login(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Email and password are required'
            });
        });

        it('should handle InvalidCredentialsError', async () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };

            vi.mocked(mockLoginUseCase.execute).mockRejectedValue(
                new InvalidCredentialsError()
            );

            await controller.login(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid email or password'
            });
        });
    });
});