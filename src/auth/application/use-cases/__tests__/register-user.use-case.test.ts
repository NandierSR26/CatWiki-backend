import { describe, it, expect, vi } from 'vitest';
import { RegisterUserUseCase } from '../register-user.use-case.js';
import { User } from '../../../domain/entities/user.entity.js';
import { UserAlreadyExistsError } from '../../../domain/errors/user-already-exists.error.js';
import type { UserRepository } from '../../../domain/repositories/user.repository.js';
import type { PasswordHasher } from '../../interfaces/password-hasher.interface.js';

describe('RegisterUserUseCase', () => {
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

    const registerUserUseCase = new RegisterUserUseCase(mockUserRepository, mockPasswordHasher);

    const validDto = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
    };

    it('should register a new user successfully', async () => {
        const hashedPassword = 'HashedPassword123!';
        const savedUser = User.create(
            { value: validDto.email } as any,
            { value: hashedPassword } as any,
            validDto.name
        );

        vi.mocked(mockUserRepository.existsByEmail).mockResolvedValue(false);
        vi.mocked(mockPasswordHasher.hash).mockResolvedValue(hashedPassword);
        vi.mocked(mockUserRepository.save).mockResolvedValue(savedUser);

        const result = await registerUserUseCase.execute(validDto);

        expect(mockUserRepository.existsByEmail).toHaveBeenCalled();
        expect(mockPasswordHasher.hash).toHaveBeenCalledWith(validDto.password);
        expect(mockUserRepository.save).toHaveBeenCalled();
        expect(result).toBe(savedUser);
    });

    it('should throw error when user already exists', async () => {
        vi.mocked(mockUserRepository.existsByEmail).mockResolvedValue(true);

        await expect(registerUserUseCase.execute(validDto)).rejects.toThrow(UserAlreadyExistsError);
    });

    it('should throw error when password is invalid', async () => {
        const invalidDto = {
            email: 'test@example.com',
            password: 'weakpass', // No cumple con los criterios
            name: 'Test User',
        };

        vi.mocked(mockUserRepository.existsByEmail).mockResolvedValue(false);

        await expect(registerUserUseCase.execute(invalidDto)).rejects.toThrow('Password must contain at least one lowercase letter, one uppercase letter, one number and one special character');
    });
});