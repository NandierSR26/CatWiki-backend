import { describe, it, expect, vi } from 'vitest';
import { GetUserByIdUseCase } from '../get-user-by-id.use-case.js';
import { User } from '../../../domain/entities/user.entity.js';
import { UserNotFoundError } from '../../../domain/errors/user-not-found.error.js';
import type { UserRepository } from '../../../domain/repositories/user.repository.js';

describe('GetUserByIdUseCase', () => {
    const mockUserRepository: UserRepository = {
        save: vi.fn(),
        findById: vi.fn(),
        findByEmail: vi.fn(),
        existsByEmail: vi.fn(),
        checkAuthentication: vi.fn(),
    };

    const getUserByIdUseCase = new GetUserByIdUseCase(mockUserRepository);

    it('should get user by id successfully', async () => {
        const userId = '507f1f77bcf86cd799439011';
        const user = User.fromPrimitives({
            id: userId,
            email: 'test@example.com',
            password: 'HashedPassword123!',
            name: 'Test User',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        vi.mocked(mockUserRepository.findById).mockResolvedValue(user);

        const result = await getUserByIdUseCase.execute(userId);

        expect(mockUserRepository.findById).toHaveBeenCalled();
        expect(result.id).toBe(userId);
        expect(result.email).toBe('test@example.com');
        expect(result.name).toBe('Test User');
    });

    it('should throw error when user not found', async () => {
        const userId = '507f1f77bcf86cd799439011';
        vi.mocked(mockUserRepository.findById).mockResolvedValue(null);

        await expect(getUserByIdUseCase.execute(userId)).rejects.toThrow(UserNotFoundError);
    });
});