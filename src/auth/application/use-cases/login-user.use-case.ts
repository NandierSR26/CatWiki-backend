import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error.js';
import type { UserRepository } from '../../domain/repositories/user.repository.js';
import { UserEmail } from '../../domain/value-objects/user-email.js';
import type { AuthResponseDto } from '../dtos/auth-response.dto.js';
import type { LoginUserDto } from '../dtos/login-user.dto.js';
import type { JwtService } from '../interfaces/jwt.service.interface.js';
import type { PasswordHasher } from '../interfaces/password-hasher.interface.js';

export class LoginUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly jwtService: JwtService
    ) { }

    async execute(dto: LoginUserDto): Promise<AuthResponseDto> {
        const email = new UserEmail(dto.email);

        // Buscar el usuario por email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new InvalidCredentialsError();
        }

        // Verificar la contraseña
        const isValidPassword = await this.passwordHasher.compare(dto.password, user.password.value);
        if (!isValidPassword) {
            throw new InvalidCredentialsError();
        }

        // Verificar que el usuario esté activo
        if (!user.isActive) {
            throw new InvalidCredentialsError();
        }

        // Generar JWT
        if (!user.id) {
            throw new Error('User ID is required for authentication');
        }

        const token = await this.jwtService.generateToken({
            userId: user.id.value,
            email: user.email.value
        });

        return {
            token,
            user: {
                id: user.id.value,
                email: user.email.value,
                name: user.name
            }
        };
    }
}