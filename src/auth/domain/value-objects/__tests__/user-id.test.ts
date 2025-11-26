import { describe, it, expect } from 'vitest';
import { Types } from 'mongoose';
import { UserId } from '../user-id.js';
import { InvalidUserIdError } from '../../errors/invalid-user-id.error.js';

describe('UserId', () => {
    describe('Valid IDs', () => {
        it('should create a valid ObjectId', () => {
            const validObjectId = new Types.ObjectId().toString();
            const userId = new UserId(validObjectId);
            expect(userId.value).toBe(validObjectId);
        });

        it('should create from ObjectId instance', () => {
            const objectId = new Types.ObjectId();
            const userId = UserId.fromObjectId(objectId);
            expect(userId.value).toBe(objectId.toString());
        });

        it('should generate a new ObjectId', () => {
            const userId = UserId.generate();
            expect(userId.value).toBeDefined();
            expect(Types.ObjectId.isValid(userId.value)).toBe(true);
        });
    });

    describe('Invalid IDs', () => {
        it('should throw error for empty ID', () => {
            expect(() => new UserId('')).toThrow(InvalidUserIdError);
            expect(() => new UserId('')).toThrow('User ID is required');
        });

        it('should throw error for null or undefined', () => {
            expect(() => new UserId(null as any)).toThrow(InvalidUserIdError);
            expect(() => new UserId(undefined as any)).toThrow(InvalidUserIdError);
        });

        it('should throw error for invalid ObjectId format', () => {
            const invalidIds = [
                'invalid-id',
                '12345',
                'not-an-objectid',
                '507f1f77bcf86cd799439011xxx'
            ];

            for (const invalidId of invalidIds) {
                expect(() => new UserId(invalidId)).toThrow(InvalidUserIdError);
                expect(() => new UserId(invalidId)).toThrow('User ID must be a valid ObjectId');
            }
        });
    });

    describe('Methods', () => {
        it('should convert to ObjectId', () => {
            const objectId = new Types.ObjectId();
            const userId = UserId.fromObjectId(objectId);
            const convertedObjectId = userId.toObjectId();
            
            expect(convertedObjectId.toString()).toBe(objectId.toString());
        });

        it('should compare IDs correctly', () => {
            const objectId = new Types.ObjectId();
            const userId1 = UserId.fromObjectId(objectId);
            const userId2 = UserId.fromObjectId(objectId);
            const userId3 = UserId.generate();

            expect(userId1.equals(userId2)).toBe(true);
            expect(userId1.equals(userId3)).toBe(false);
        });

        it('should convert to string', () => {
            const objectId = new Types.ObjectId();
            const userId = UserId.fromObjectId(objectId);
            expect(userId.toString()).toBe(objectId.toString());
        });
    });
});