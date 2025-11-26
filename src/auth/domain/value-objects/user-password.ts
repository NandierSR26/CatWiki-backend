import { InvalidUserPasswordError } from '../errors/invalid-user-password.error.js';

export class UserPassword {
    private static readonly MIN_LENGTH = 8;
    private static readonly MAX_LENGTH = 128;

    constructor(public readonly value: string) {
        this.ensureIsValidPassword(value);
    }

    private ensureIsValidPassword(password: string): void {
        UserPassword.validate(password);
    }

    static validate(password: string): void {
        if (!password || typeof password !== 'string') {
            throw new InvalidUserPasswordError('Password is required');
        }

        if (password.length < UserPassword.MIN_LENGTH) {
            throw new InvalidUserPasswordError(`Password must be at least ${UserPassword.MIN_LENGTH} characters long`);
        }

        if (password.length > UserPassword.MAX_LENGTH) {
            throw new InvalidUserPasswordError(`Password must not exceed ${UserPassword.MAX_LENGTH} characters`);
        }

        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasLowerCase || !hasUpperCase || !hasNumbers || !hasSpecialChar) {
            throw new InvalidUserPasswordError(
                'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character'
            );
        }
    }

    equals(other: UserPassword): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}