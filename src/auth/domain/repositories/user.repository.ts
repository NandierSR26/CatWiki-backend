import { User } from '../entities/user.entity.js';
import { UserEmail } from '../value-objects/user-email.js';
import { UserId } from '../value-objects/user-id.js';

export interface UserRepository {
    save(user: User): Promise<User>;
    findById(id: UserId): Promise<User | null>;
    findByEmail(email: UserEmail): Promise<User | null>;
    existsByEmail(email: UserEmail): Promise<boolean>;
    delete(id: UserId): Promise<void>;
}