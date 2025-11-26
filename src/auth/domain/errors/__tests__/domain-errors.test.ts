import { describe, it, expect } from 'vitest';
import { UserNotFoundError } from '../user-not-found.error.js';
import { UserAlreadyExistsError } from '../user-already-exists.error.js';
import { InvalidUserPasswordError } from '../invalid-user-password.error.js';
import { InvalidUserIdError } from '../invalid-user-id.error.js';
import { InvalidUserEmailError } from '../invalid-user-email.error.js';
import { InvalidCredentialsError } from '../invalid-credentials.error.js';

describe('Domain Errors', () => {
    describe('UserNotFoundError', () => {
        it('should create error with correct message and name', () => {
            const identifier = 'user123';
            const error = new UserNotFoundError(identifier);

            expect(error.message).toBe(`User with identifier ${identifier} not found`);
            expect(error.name).toBe('UserNotFoundError');
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe('UserAlreadyExistsError', () => {
        it('should create error with correct message and name', () => {
            const email = 'test@example.com';
            const error = new UserAlreadyExistsError(email);

            expect(error.message).toBe(`User with email ${email} already exists`);
            expect(error.name).toBe('UserAlreadyExistsError');
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe('InvalidUserPasswordError', () => {
        it('should create error with correct message and name', () => {
            const message = 'Password is too weak';
            const error = new InvalidUserPasswordError(message);

            expect(error.message).toBe(message);
            expect(error.name).toBe('InvalidUserPasswordError');
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe('InvalidUserIdError', () => {
        it('should create error with correct message and name', () => {
            const message = 'Invalid user ID format';
            const error = new InvalidUserIdError(message);

            expect(error.message).toBe(message);
            expect(error.name).toBe('InvalidUserIdError');
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe('InvalidUserEmailError', () => {
        it('should create error with correct message and name', () => {
            const message = 'Invalid email format';
            const error = new InvalidUserEmailError(message);

            expect(error.message).toBe(message);
            expect(error.name).toBe('InvalidUserEmailError');
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe('InvalidCredentialsError', () => {
        it('should create error with correct message and name', () => {
            const error = new InvalidCredentialsError();

            expect(error.message).toBe('Invalid email or password');
            expect(error.name).toBe('InvalidCredentialsError');
            expect(error).toBeInstanceOf(Error);
        });
    });
});