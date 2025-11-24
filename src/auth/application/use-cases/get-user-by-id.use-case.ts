import { UserNotFoundError } from '../../domain/errors/user-not-found.error.js';
import type { UserRepository } from '../../domain/repositories/user.repository.js';
import { UserId } from '../../domain/value-objects/user-id.js';

export class GetUserByIdUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(userId: string) {
        const id = new UserId(userId);

        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new UserNotFoundError(userId);
        }

        if (!user.id) {
            throw new Error('User ID is missing');
        }

        return {
            id: user.id.value,
            email: user.email.value,
            name: user.name,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}