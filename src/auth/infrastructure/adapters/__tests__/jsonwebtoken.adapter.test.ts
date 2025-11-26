import { describe, it, expect } from 'vitest';
import { JsonWebTokenAdapter } from '../jsonwebtoken.adapter.js';

describe('JsonWebTokenAdapter', () => {
    const secret = 'test-secret-key';
    const jwtService = new JsonWebTokenAdapter(secret);

    const testPayload = {
        userId: '507f1f77bcf86cd799439011',
        email: 'test@example.com'
    };

    describe('generateToken', () => {
        it('should generate a valid token', async () => {
            const token = await jwtService.generateToken(testPayload);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.length).toBeGreaterThan(0);
        });

        it('should generate tokens with different payloads', async () => {
            const payload1 = { userId: '1', email: 'user1@example.com' };
            const payload2 = { userId: '2', email: 'user2@example.com' };
            
            const token1 = await jwtService.generateToken(payload1);
            const token2 = await jwtService.generateToken(payload2);

            expect(token1).not.toBe(token2);
        });
    });

    describe('verifyToken', () => {
        it('should verify and decode valid token', async () => {
            const token = await jwtService.generateToken(testPayload);
            
            const decoded = await jwtService.verifyToken(token);

            expect(decoded.userId).toBe(testPayload.userId);
            expect(decoded.email).toBe(testPayload.email);
        });

        it('should throw error for invalid token', async () => {
            const invalidToken = 'invalid.token.here';

            await expect(jwtService.verifyToken(invalidToken)).rejects.toThrow('Invalid token');
        });

        it('should throw error for token with wrong secret', async () => {
            const differentService = new JsonWebTokenAdapter('different-secret');
            const token = await differentService.generateToken(testPayload);

            await expect(jwtService.verifyToken(token)).rejects.toThrow('Invalid token');
        });
    });
});