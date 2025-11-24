import jwt from 'jsonwebtoken';
import type { JwtPayload, JwtService } from '../../application/interfaces/jwt.service.interface.js';

export class JsonWebTokenService implements JwtService {
    constructor(
        private readonly secret: string,
    ) { }

    async generateToken(payload: JwtPayload): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, this.secret, {expiresIn: '2h'}, (err, token) => {
                if (err || !token) {
                    return reject(new Error(err?.message || 'Token generation failed'));
                }
                resolve(token);
            });
        });
    };

    async verifyToken(token: string): Promise<JwtPayload> {
        try {
            const decoded = jwt.verify(token, this.secret) as JwtPayload & jwt.JwtPayload;
            return {
                userId: decoded.userId,
                email: decoded.email
            };
        } catch (error) {
            throw new Error(`Invalid token: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}