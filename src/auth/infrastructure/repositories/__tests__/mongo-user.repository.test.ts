import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoUserRepository } from '../mongo-user.repository.js';
import { User } from '../../../domain/entities/user.entity.js';
import { UserEmail } from '../../../domain/value-objects/user-email.js';
import { UserId } from '../../../domain/value-objects/user-id.js';
import { UserModel } from '../../models/user.model.js';

// Mock the UserModel
vi.mock('../../models/user.model.js', () => ({
    UserModel: {
        findById: vi.fn(),
        findOne: vi.fn(),
        exists: vi.fn(),
        countDocuments: vi.fn(),
        prototype: {
            save: vi.fn(),
        },
        // Mock constructor
        mockImplementation: function(data: any) {
            return {
                _id: '507f1f77bcf86cd799439011',
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
                save: vi.fn().mockResolvedValue({
                    _id: '507f1f77bcf86cd799439011',
                    ...data,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
            };
        },
    },
}));

describe('MongoUserRepository', () => {
    let repository: MongoUserRepository;

    beforeEach(() => {
        repository = new MongoUserRepository();
        vi.clearAllMocks();
    });



    const mockUserDoc = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        password: 'HashedPassword123!',
        name: 'Test User',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        save: vi.fn(),
    };

    describe('findById', () => {
        it('should find user by id successfully', async () => {
            const userId = new UserId('507f1f77bcf86cd799439011');
            vi.mocked(UserModel.findById).mockResolvedValue(mockUserDoc as any);

            const result = await repository.findById(userId);

            expect(UserModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
            expect(result).toBeInstanceOf(User);
            expect(result?.toPrimitives().email).toBe('test@example.com');
        });

        it('should return null when user not found', async () => {
            const userId = new UserId('507f1f77bcf86cd799439011');
            vi.mocked(UserModel.findById).mockResolvedValue(null);

            const result = await repository.findById(userId);

            expect(UserModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
            expect(result).toBeNull();
        });
    });

    describe('findByEmail', () => {
        it('should find user by email successfully', async () => {
            const email = new UserEmail('test@example.com');
            vi.mocked(UserModel.findOne).mockResolvedValue(mockUserDoc as any);

            const result = await repository.findByEmail(email);

            expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(result).toBeInstanceOf(User);
            expect(result?.toPrimitives().email).toBe('test@example.com');
        });

        it('should return null when user not found by email', async () => {
            const email = new UserEmail('notfound@example.com');
            vi.mocked(UserModel.findOne).mockResolvedValue(null);

            const result = await repository.findByEmail(email);

            expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'notfound@example.com' });
            expect(result).toBeNull();
        });
    });

    describe('existsByEmail', () => {
        it('should return true when user exists', async () => {
            const email = new UserEmail('existing@example.com');
            vi.mocked(UserModel.countDocuments).mockResolvedValue(1);

            const result = await repository.existsByEmail(email);

            expect(UserModel.countDocuments).toHaveBeenCalledWith({ email: 'existing@example.com' });
            expect(result).toBe(true);
        });

        it('should return false when user does not exist', async () => {
            const email = new UserEmail('nonexistent@example.com');
            vi.mocked(UserModel.countDocuments).mockResolvedValue(0);

            const result = await repository.existsByEmail(email);

            expect(UserModel.countDocuments).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
            expect(result).toBe(false);
        });
    });

    describe('checkAuthentication', () => {
        it('should return user when found and active', async () => {
            const userId = new UserId('507f1f77bcf86cd799439011');
            vi.mocked(UserModel.findById).mockResolvedValue(mockUserDoc as any);

            const result = await repository.checkAuthentication(userId);

            expect(UserModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
            expect(result).toBeInstanceOf(User);
        });

        it('should return null when user not found', async () => {
            const userId = new UserId('507f1f77bcf86cd799439011');
            vi.mocked(UserModel.findById).mockResolvedValue(null);

            const result = await repository.checkAuthentication(userId);

            expect(result).toBeNull();
        });
    });
});