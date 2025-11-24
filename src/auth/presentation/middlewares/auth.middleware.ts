import type { Request, Response, NextFunction } from 'express';
import type { JwtService } from '../../application/interfaces/jwt.service.interface.js';

interface AuthenticatedRequest extends Request {
    userId?: string;
    userEmail?: string;
}

export class AuthMiddleware {
    constructor(private readonly jwtService: JwtService) { }

    authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader?.startsWith('Bearer ')) {
                res.status(401).json({ error: 'Access token is required' });
                return;
            }

            const token = authHeader.substring(7); // Remove 'Bearer ' prefix

            const payload = await this.jwtService.verifyToken(token);

            req.userId = payload.userId;
            req.userEmail = payload.email;

            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(401).json({ error: 'Invalid or expired token' });
        }
    };
}