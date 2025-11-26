import { describe, it, expect } from 'vitest';
import { UserEmail } from '../user-email.js';
import { InvalidUserEmailError } from '../../errors/invalid-user-email.error.js';

describe('UserEmail', () => {
    describe('Valid emails', () => {
        it('should create a valid email', () => {
            const email = new UserEmail('test@example.com');
            expect(email.value).toBe('test@example.com');
        });

        it('should accept different email formats', () => {
            const validEmails = [
                'user@domain.com',
                'user.name@domain.co.uk',
                'user+tag@domain.org',
                'user123@domain123.com',
                'a@b.co'
            ];

            for (const emailStr of validEmails) {
                const email = new UserEmail(emailStr);
                expect(email.value).toBe(emailStr);
            }
        });
    });

    describe('Invalid emails', () => {
        it('should throw error for empty email', () => {
            expect(() => new UserEmail('')).toThrow(InvalidUserEmailError);
            expect(() => new UserEmail('')).toThrow('Email is required');
        });

        it('should throw error for null or undefined', () => {
            expect(() => new UserEmail(null as any)).toThrow(InvalidUserEmailError);
            expect(() => new UserEmail(undefined as any)).toThrow(InvalidUserEmailError);
        });

        it('should throw error for invalid email format', () => {
            const invalidEmails = [
                'invalid-email',
                '@domain.com',
                'user@',
                'user.domain.com',
                'user@@domain.com'
            ];

            for (const invalidEmail of invalidEmails) {
                expect(() => new UserEmail(invalidEmail)).toThrow(InvalidUserEmailError);
                expect(() => new UserEmail(invalidEmail)).toThrow('Email format is invalid');
            }
        });

        it('should throw error for email too long', () => {
            const longEmail = 'a'.repeat(250) + '@domain.com';
            expect(() => new UserEmail(longEmail)).toThrow(InvalidUserEmailError);
            expect(() => new UserEmail(longEmail)).toThrow('Email is too long');
        });
    });

    describe('Methods', () => {
        it('should compare emails correctly', () => {
            const email1 = new UserEmail('test@example.com');
            const email2 = new UserEmail('test@example.com');
            const email3 = new UserEmail('different@example.com');

            expect(email1.equals(email2)).toBe(true);
            expect(email1.equals(email3)).toBe(false);
        });

        it('should convert to string', () => {
            const email = new UserEmail('test@example.com');
            expect(email.toString()).toBe('test@example.com');
        });
    });
});