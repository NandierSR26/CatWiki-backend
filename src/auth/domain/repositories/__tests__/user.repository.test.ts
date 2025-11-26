import { describe, it, expect, vi } from 'vitest';
import type { UserRepository } from '../user.repository.js';
import { User } from '../../entities/user.entity.js';
import { UserEmail } from '../../value-objects/user-email.js';
import { UserId } from '../../value-objects/user-id.js';
import { UserPassword } from '../../value-objects/user-password.js';

describe('UserRepository Interface', () => {
    const createMockRepository = (): UserRepository => ({
        save: vi.fn(),
        findById: vi.fn(),
        findByEmail: vi.fn(),
        existsByEmail: vi.fn(),
        checkAuthentication: vi.fn(),
    });

    const createTestUser = (): User => {
        const email = new UserEmail('test@example.com');
        const password = new UserPassword('TestPassword123!');
        return User.create(email, password, 'Test User');
    };

    describe('save', () => {
        it('should save user and return user with id', async () => {
            const mockRepository = createMockRepository();
            const user = createTestUser();
            const savedUser = User.fromPrimitives({
                id: '507f1f77bcf86cd799439011',
                email: 'test@example.com',
                password: 'TestPassword123!',
                name: 'Test User',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            vi.mocked(mockRepository.save).mockResolvedValue(savedUser);

            const result = await mockRepository.save(user);

            expect(mockRepository.save).toHaveBeenCalledWith(user);
            expect(result).toBe(savedUser);
            expect(result.id).toBeDefined();
        });
    });

    describe('findById', () => {
        it('should find user by id', async () => {
            const mockRepository = createMockRepository();
            const userId = new UserId('507f1f77bcf86cd799439011');
            const user = User.fromPrimitives({
                id: '507f1f77bcf86cd799439011',
                email: 'test@example.com',
                password: 'TestPassword123!',
                name: 'Test User',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            vi.mocked(mockRepository.findById).mockResolvedValue(user);

            const result = await mockRepository.findById(userId);

            expect(mockRepository.findById).toHaveBeenCalledWith(userId);
            expect(result).toBe(user);
        });

        it('should return null when user not found', async () => {
            const mockRepository = createMockRepository();
            const userId = new UserId('507f1f77bcf86cd799439011');

            vi.mocked(mockRepository.findById).mockResolvedValue(null);

            const result = await mockRepository.findById(userId);

            expect(mockRepository.findById).toHaveBeenCalledWith(userId);
            expect(result).toBeNull();
        });
    });

    describe('findByEmail', () => {
        it('should find user by email', async () => {
            const mockRepository = createMockRepository();
            const email = new UserEmail('test@example.com');
            const user = User.fromPrimitives({
                id: '507f1f77bcf86cd799439011',
                email: 'test@example.com',
                password: 'TestPassword123!',
                name: 'Test User',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            vi.mocked(mockRepository.findByEmail).mockResolvedValue(user);

            const result = await mockRepository.findByEmail(email);

            expect(mockRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(result).toBe(user);
        });

        it('should return null when user not found by email', async () => {
            const mockRepository = createMockRepository();
            const email = new UserEmail('notfound@example.com');

            vi.mocked(mockRepository.findByEmail).mockResolvedValue(null);

            const result = await mockRepository.findByEmail(email);

            expect(mockRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(result).toBeNull();
        });
    });

    describe('existsByEmail', () => {
        it('should return true when user exists', async () => {
            const mockRepository = createMockRepository();
            const email = new UserEmail('existing@example.com');

            vi.mocked(mockRepository.existsByEmail).mockResolvedValue(true);

            const result = await mockRepository.existsByEmail(email);

            expect(mockRepository.existsByEmail).toHaveBeenCalledWith(email);
            expect(result).toBe(true);
        });

        it('should return false when user does not exist', async () => {
            const mockRepository = createMockRepository();
            const email = new UserEmail('nonexistent@example.com');

            vi.mocked(mockRepository.existsByEmail).mockResolvedValue(false);

            const result = await mockRepository.existsByEmail(email);

            expect(mockRepository.existsByEmail).toHaveBeenCalledWith(email);
            expect(result).toBe(false);
        });
    });

    describe('checkAuthentication', () => {
        it('should return user when authenticated', async () => {
            const mockRepository = createMockRepository();
            const userId = new UserId('507f1f77bcf86cd799439011');
            const user = User.fromPrimitives({
                id: '507f1f77bcf86cd799439011',
                email: 'test@example.com',
                password: 'TestPassword123!',
                name: 'Test User',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            vi.mocked(mockRepository.checkAuthentication).mockResolvedValue(user);

            const result = await mockRepository.checkAuthentication(userId);

            expect(mockRepository.checkAuthentication).toHaveBeenCalledWith(userId);
            expect(result).toBe(user);
        });

        it('should return null when authentication fails', async () => {
            const mockRepository = createMockRepository();
            const userId = new UserId('507f1f77bcf86cd799439011');

            vi.mocked(mockRepository.checkAuthentication).mockResolvedValue(null);

            const result = await mockRepository.checkAuthentication(userId);

            expect(mockRepository.checkAuthentication).toHaveBeenCalledWith(userId);
            expect(result).toBeNull();
        });
    });
});