import { describe, it, expect } from 'vitest';
import { User } from '../user.entity.js';
import { UserEmail } from '../../value-objects/user-email.js';
import { UserPassword } from '../../value-objects/user-password.js';
import { UserId } from '../../value-objects/user-id.js';

describe('User Entity', () => {
    const validEmail = new UserEmail('john.doe@example.com');
    const validPassword = new UserPassword('ValidPassword123!');
    const validName = 'John Doe';

    describe('create', () => {
        it('should create a new user with valid data', () => {
            const user = User.create(validEmail, validPassword, validName);

            expect(user.email).toBe(validEmail);
            expect(user.password).toBe(validPassword);
            expect(user.name).toBe(validName);
            expect(user.isActive).toBe(true);
            expect(user.createdAt).toBeInstanceOf(Date);
            expect(user.updatedAt).toBeInstanceOf(Date);
            expect(user.id).toBeUndefined();
        });
    });

    describe('fromPrimitives', () => {
        it('should create user from primitive data', () => {
            const primitiveData = {
                id: '507f1f77bcf86cd799439011',
                email: 'john.doe@example.com',
                password: 'HashedPassword123!',
                name: 'John Doe',
                isActive: true,
                createdAt: new Date('2023-01-01'),
                updatedAt: new Date('2023-01-02'),
            };

            const user = User.fromPrimitives(primitiveData);

            expect(user.id).toBeInstanceOf(UserId);
            expect(user.email).toBeInstanceOf(UserEmail);
            expect(user.password).toBeInstanceOf(UserPassword);
            expect(user.name).toBe(primitiveData.name);
            expect(user.isActive).toBe(primitiveData.isActive);
        });
    });

    describe('methods', () => {
        it('should update password', () => {
            const user = User.create(validEmail, validPassword, validName);
            const newPassword = new UserPassword('NewPassword456!');

            user.updatePassword(newPassword);

            expect(user.password).toBe(newPassword);
        });

        it('should deactivate user', () => {
            const user = User.create(validEmail, validPassword, validName);

            user.deactivate();

            expect(user.isActive).toBe(false);
        });

        it('should activate user', () => {
            const user = User.create(validEmail, validPassword, validName);
            user.deactivate();

            user.activate();

            expect(user.isActive).toBe(true);
        });
    });

    describe('toPrimitives', () => {
        it('should convert user to primitives', () => {
            const user = User.create(validEmail, validPassword, validName);
            const result = user.toPrimitives();

            expect(result.email).toBe(validEmail.value);
            expect(result.password).toBe(validPassword.value);
            expect(result.name).toBe(validName);
            expect(result.isActive).toBe(true);
        });
    });
});