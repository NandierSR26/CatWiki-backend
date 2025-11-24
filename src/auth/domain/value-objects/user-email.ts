import { InvalidUserEmailError } from '../errors/invalid-user-email.error.js';

export class UserEmail {
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    constructor(public readonly value: string) {
        this.ensureIsValidEmail(value);
    }

    private ensureIsValidEmail(email: string): void {
        if (!email || typeof email !== 'string') {
            throw new InvalidUserEmailError('Email is required');
        }

        if (!UserEmail.EMAIL_REGEX.test(email)) {
            throw new InvalidUserEmailError('Email format is invalid');
        }

        if (email.length > 255) {
            throw new InvalidUserEmailError('Email is too long');
        }
    }

    equals(other: UserEmail): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}