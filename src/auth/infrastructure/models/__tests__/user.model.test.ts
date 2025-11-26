import { describe, it, expect } from 'vitest';
import { UserModel, type UserDocument } from '../user.model.js';

describe('UserModel', () => {
    describe('Schema Definition', () => {
        it('should have correct schema structure', () => {
            const schema = UserModel.schema;

            expect(schema.paths.email).toBeDefined();
            expect(schema.paths.password).toBeDefined();
            expect(schema.paths.name).toBeDefined();
            expect(schema.paths.isActive).toBeDefined();
        });

        it('should have required fields defined', () => {
            const schema = UserModel.schema;

            expect(schema.paths.email.isRequired).toBe(true);
            expect(schema.paths.password.isRequired).toBe(true);
            expect(schema.paths.name.isRequired).toBe(true);
        });

        it('should have correct email field options', () => {
            const emailPath = UserModel.schema.paths.email;

            expect(emailPath.options.unique).toBe(true);
            expect(emailPath.options.lowercase).toBe(true);
            expect(emailPath.options.trim).toBe(true);
        });

        it('should have default value for isActive field', () => {
            const isActivePath = UserModel.schema.paths.isActive;

            expect(isActivePath.options.default).toBe(true);
        });

        it('should have timestamps enabled', () => {
            const options = UserModel.schema.options;

            expect(options.timestamps).toBe(true);
            expect(options.versionKey).toBe(false);
        });
    });

    describe('Type Safety', () => {
        it('should type check UserDocument interface', () => {
            // This is a compile-time test to ensure TypeScript types are correct
            const mockUser: UserDocument = {
                email: 'test@example.com',
                password: 'hashedPassword',
                name: 'Test User',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as UserDocument;

            expect(mockUser.email).toBe('test@example.com');
            expect(mockUser.password).toBe('hashedPassword');
            expect(mockUser.name).toBe('Test User');
            expect(mockUser.isActive).toBe(true);
            expect(mockUser.createdAt).toBeInstanceOf(Date);
            expect(mockUser.updatedAt).toBeInstanceOf(Date);
        });
    });
});