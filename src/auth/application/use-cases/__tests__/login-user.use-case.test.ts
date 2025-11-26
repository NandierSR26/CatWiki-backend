import { describe, it, expect, vi } from 'vitest';
import { LoginUserUseCase } from '../login-user.use-case.js';
import { User } from '../../../domain/entities/user.entity.js';
import { InvalidCredentialsError } from '../../../domain/errors/invalid-credentials.error.js';
import type { UserRepository } from '../../../domain/repositories/user.repository.js';
import type { PasswordHasher } from '../../interfaces/password-hasher.interface.js';
import type { JwtService } from '../../interfaces/jwt.service.interface.js';

describe('LoginUserUseCase', () => {
    const mockUserRepository: UserRepository = {
        save: vi.fn(),
        findById: vi.fn(),
        findByEmail: vi.fn(),
        existsByEmail: vi.fn(),
        checkAuthentication: vi.fn(),
    };

    const mockPasswordHasher: PasswordHasher = {
        hash: vi.fn(),
        compare: vi.fn(),
    };

    const mockJwtService: JwtService = {
        generateToken: vi.fn(),
        verifyToken: vi.fn(),
    };

    const loginUserUseCase = new LoginUserUseCase(
        mockUserRepository,
        mockPasswordHasher,
        mockJwtService
    );

    const validDto = {
        email: 'test@example.com',
        password: 'Password123!',
    };

    it('should login user successfully', async () => {
        const user = User.fromPrimitives({
            id: '507f1f77bcf86cd799439011',
            email: validDto.email,
            password: 'HashedPassword123!',
            name: 'Test User',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const token = 'jwt_token';

        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(user);
        vi.mocked(mockPasswordHasher.compare).mockResolvedValue(true);
        vi.mocked(mockJwtService.generateToken).mockResolvedValue(token);

        const result = await loginUserUseCase.execute(validDto);

        expect(mockUserRepository.findByEmail).toHaveBeenCalled();
        expect(mockPasswordHasher.compare).toHaveBeenCalledWith(validDto.password, user.password.value);
        expect(mockJwtService.generateToken).toHaveBeenCalled();
        expect(result.token).toBe(token);
        expect(result.user.email).toBe(validDto.email);
    });

    it('should throw error when user not found', async () => {
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

        await expect(loginUserUseCase.execute(validDto)).rejects.toThrow(InvalidCredentialsError);
    });

    it('should throw error when password is invalid', async () => {
        const user = User.fromPrimitives({
            id: '507f1f77bcf86cd799439011',
            email: validDto.email,
            password: 'HashedPassword123!',
            name: 'Test User',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(user);
        vi.mocked(mockPasswordHasher.compare).mockResolvedValue(false);

        await expect(loginUserUseCase.execute(validDto)).rejects.toThrow(InvalidCredentialsError);
    });

    it('should throw error when user is inactive', async () => {
        const user = User.fromPrimitives({
            id: '507f1f77bcf86cd799439011',
            email: validDto.email,
            password: 'HashedPassword123!',
            name: 'Test User',
            isActive: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(user);
        vi.mocked(mockPasswordHasher.compare).mockResolvedValue(true);

        await expect(loginUserUseCase.execute(validDto)).rejects.toThrow(InvalidCredentialsError);
    });
});