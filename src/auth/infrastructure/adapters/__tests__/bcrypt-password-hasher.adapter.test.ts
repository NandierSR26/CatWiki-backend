import { describe, it, expect } from 'vitest';
import { BcryptPasswordHasherAdapter } from '../bcrypt-password-hasher.adapter.js';

describe('BcryptPasswordHasherAdapter', () => {
    const passwordHasher = new BcryptPasswordHasherAdapter();

    describe('hash', () => {
        it('should hash password successfully', async () => {
            const password = 'TestPassword123!';
            
            const hashedPassword = await passwordHasher.hash(password);

            expect(hashedPassword).toBeDefined();
            expect(hashedPassword).not.toBe(password);
            expect(hashedPassword.length).toBeGreaterThan(0);
        });

        it('should generate different hashes for same password', async () => {
            const password = 'TestPassword123!';
            
            const hash1 = await passwordHasher.hash(password);
            const hash2 = await passwordHasher.hash(password);

            expect(hash1).not.toBe(hash2);
        });
    });

    describe('compare', () => {
        it('should return true for correct password', async () => {
            const password = 'TestPassword123!';
            const hashedPassword = await passwordHasher.hash(password);

            const result = await passwordHasher.compare(password, hashedPassword);

            expect(result).toBe(true);
        });

        it('should return false for incorrect password', async () => {
            const password = 'TestPassword123!';
            const wrongPassword = 'WrongPassword456!';
            const hashedPassword = await passwordHasher.hash(password);

            const result = await passwordHasher.compare(wrongPassword, hashedPassword);

            expect(result).toBe(false);
        });
    });
});