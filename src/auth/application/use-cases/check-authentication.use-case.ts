import type { User } from "../../domain/entities/user.entity.js";
import type { UserRepository } from "../../domain/repositories/user.repository.js";
import type { UserId } from "../../domain/value-objects/user-id.js";


export class CheckAuthenticationUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ) {}
    async execute(id: UserId): Promise<User | null> {
        const user = await this.userRepository.findById(id);
        
        if (user) {
            return user;
        }
        return null;
    }
}