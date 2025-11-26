import { describe, it, expect } from 'vitest';
import { UserPassword } from '../user-password.js';
import { InvalidUserPasswordError } from '../../errors/invalid-user-password.error.js';

describe('UserPassword', () => {
    describe('Valid passwords', () => {
        it('should create a valid password', () => {
            const password = new UserPassword('ValidPass123!');
            expect(password.value).toBe('ValidPass123!');
        });

        it('should accept passwords with all required characters', () => {
            const validPasswords = [
                'Password123!',
                'MySecure123@',
                'Strong2024#',
                'Complex$Pass1'
            ];

            for (const passwordStr of validPasswords) {
                const password = new UserPassword(passwordStr);
                expect(password.value).toBe(passwordStr);
            }
        });
    });

    describe('Invalid passwords', () => {
        it('should throw error for empty password', () => {
            expect(() => new UserPassword('')).toThrow(InvalidUserPasswordError);
            expect(() => new UserPassword('')).toThrow('Password is required');
        });

        it('should throw error for null or undefined', () => {
            expect(() => new UserPassword(null as any)).toThrow(InvalidUserPasswordError);
            expect(() => new UserPassword(undefined as any)).toThrow(InvalidUserPasswordError);
        });

        it('should throw error for password too short', () => {
            const shortPassword = 'Pass1!';
            expect(() => new UserPassword(shortPassword)).toThrow(InvalidUserPasswordError);
            expect(() => new UserPassword(shortPassword)).toThrow('Password must be at least 8 characters long');
        });

        it('should throw error for missing lowercase letter', () => {
            const password = 'PASSWORD123!';
            expect(() => new UserPassword(password)).toThrow(InvalidUserPasswordError);
        });

        it('should throw error for missing uppercase letter', () => {
            const password = 'password123!';
            expect(() => new UserPassword(password)).toThrow(InvalidUserPasswordError);
        });

        it('should throw error for missing number', () => {
            const password = 'Password!';
            expect(() => new UserPassword(password)).toThrow(InvalidUserPasswordError);
        });

        it('should throw error for missing special character', () => {
            const password = 'Password123';
            expect(() => new UserPassword(password)).toThrow(InvalidUserPasswordError);
        });
    });

    describe('Methods', () => {
        it('should compare passwords correctly', () => {
            const password1 = new UserPassword('ValidPass123!');
            const password2 = new UserPassword('ValidPass123!');
            const password3 = new UserPassword('DifferentPass456@');

            expect(password1.equals(password2)).toBe(true);
            expect(password1.equals(password3)).toBe(false);
        });

        it('should convert to string', () => {
            const password = new UserPassword('ValidPassword123!');
            expect(password.toString()).toBe('ValidPassword123!');
        });
    });

    describe('static validate', () => {
        it('should validate valid password without throwing', () => {
            expect(() => UserPassword.validate('ValidPassword123!')).not.toThrow();
        });

        it('should throw error for invalid password', () => {
            expect(() => UserPassword.validate('weakpass')).toThrow(InvalidUserPasswordError);
            expect(() => UserPassword.validate('weakpass')).toThrow('Password must contain at least one lowercase letter, one uppercase letter, one number and one special character');
        });

        it('should throw error for empty password', () => {
            expect(() => UserPassword.validate('')).toThrow(InvalidUserPasswordError);
            expect(() => UserPassword.validate('')).toThrow('Password is required');
        });
    });
});