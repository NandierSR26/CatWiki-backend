import { User } from '../../domain/entities/user.entity.js';
import { UserAlreadyExistsError } from '../../domain/errors/user-already-exists.error.js';
import type { UserRepository } from '../../domain/repositories/user.repository.js';
import { UserEmail } from '../../domain/value-objects/user-email.js';
import { UserPassword } from '../../domain/value-objects/user-password.js';
import type { RegisterUserDto } from '../dtos/register-user.dto.js';
import type { PasswordHasher } from '../interfaces/password-hasher.interface.js';

export class RegisterUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher
    ) { }

    async execute(dto: RegisterUserDto): Promise<User> {
        const email = new UserEmail(dto.email);

        const existsUser = await this.userRepository.existsByEmail(email);
        if (existsUser) {
            throw new UserAlreadyExistsError(dto.email);
        }

        UserPassword.validate(dto.password);
        
        const hashedPassword = await this.passwordHasher.hash(dto.password);
        const password = new UserPassword(hashedPassword);

        const user = User.create(email, password, dto.name);

        const savedUser = await this.userRepository.save(user);

        return savedUser;
    }
}