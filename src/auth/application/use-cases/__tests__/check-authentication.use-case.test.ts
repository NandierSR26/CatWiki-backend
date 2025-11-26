import { describe, it, expect, vi } from 'vitest';
import { CheckAuthenticationUseCase } from '../check-authentication.use-case.js';
import { User } from '../../../domain/entities/user.entity.js';
import { UserId } from '../../../domain/value-objects/user-id.js';
import type { UserRepository } from '../../../domain/repositories/user.repository.js';

describe('CheckAuthenticationUseCase', () => {
    const mockUserRepository: UserRepository = {
        save: vi.fn(),
        findById: vi.fn(),
        findByEmail: vi.fn(),
        existsByEmail: vi.fn(),
        checkAuthentication: vi.fn(),
    };

    const checkAuthUseCase = new CheckAuthenticationUseCase(mockUserRepository);

    it('should return user when found', async () => {
        const userId = new UserId('507f1f77bcf86cd799439011');
        const user = User.fromPrimitives({
            id: '507f1f77bcf86cd799439011',
            email: 'test@example.com',
            password: 'HashedPassword123!',
            name: 'Test User',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        vi.mocked(mockUserRepository.findById).mockResolvedValue(user);

        const result = await checkAuthUseCase.execute(userId);

        expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(user);
    });

    it('should return null when user not found', async () => {
        const userId = new UserId('507f1f77bcf86cd799439011');
        vi.mocked(mockUserRepository.findById).mockResolvedValue(null);

        const result = await checkAuthUseCase.execute(userId);

        expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBeNull();
    });
});