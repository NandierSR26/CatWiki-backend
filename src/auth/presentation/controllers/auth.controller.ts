import type { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case.js';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case.js';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case.js';
import { UserAlreadyExistsError } from '../../domain/errors/user-already-exists.error.js';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error.js';
import { InvalidUserEmailError } from '../../domain/errors/invalid-user-email.error.js';
import { InvalidUserPasswordError } from '../../domain/errors/invalid-user-password.error.js';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error.js';
import type { CheckAuthenticationUseCase } from '../../application/use-cases/check-authentication.use-case.js';

export class AuthController {
    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly loginUserUseCase: LoginUserUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly checkAuthenticationUseCase: CheckAuthenticationUseCase
    ) { }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, name } = req.body;

            if (!email || !password || !name) {
                res.status(400).json({
                    message: 'Email, password and name are required'
                });
                return;
            }

            const user = await this.registerUserUseCase.execute({
                email,
                password,
                name
            });

            res.status(201).json({
                message: 'User registered successfully, sign in to continue',
                user: {
                    id: user.id?.value,
                    email: user.email.value,
                    name: user.name
                }
            });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({
                    error: 'Email and password are required'
                });
                return;
            }

            const authResponse = await this.loginUserUseCase.execute({
                email,
                password
            });

            res.status(200).json({
                message: 'Login successful',
                data: authResponse
            });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    getProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).userId;

            const user = await this.getUserByIdUseCase.execute(userId);

            res.status(200).json({
                message: 'User profile retrieved successfully',
                user
            });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    checkAuthentication = async (req: Request, res: Response): Promise<void> => {
        try {
            // El userId viene del middleware de autenticación
            const userId = (req as any).userId;

            const user = await this.checkAuthenticationUseCase.execute(userId);

            if (user) {
                res.status(200).json({
                    message: 'User is authenticated',
                    auth: true,
                    user
                });
            } else {
                res.status(401).json({
                    message: 'User is not authenticated',
                    auth: false
                });
            }
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof UserAlreadyExistsError) {
            res.status(409).json({ message: error.message });
            return;
        }

        if (error instanceof InvalidCredentialsError) {
            res.status(401).json({ message: error.message });
            return;
        }

        if (error instanceof InvalidUserEmailError || error instanceof InvalidUserPasswordError) {
            res.status(400).json({ message: error.message });
            return;
        }

        if (error instanceof UserNotFoundError) {
            res.status(404).json({ message: error.message });
            return;
        }

        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}