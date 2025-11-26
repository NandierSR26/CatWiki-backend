import { User } from '../../domain/entities/user.entity.js';
import type { UserRepository } from '../../domain/repositories/user.repository.js';
import { UserEmail } from '../../domain/value-objects/user-email.js';
import { UserId } from '../../domain/value-objects/user-id.js';
import { UserModel } from '../models/user.model.js';

export class MongoUserRepository implements UserRepository {

    async save(user: User): Promise<User> {
        const userPrimitives = user.toPrimitives();

        const newUserDoc = new UserModel({
            email: userPrimitives.email,
            password: userPrimitives.password,
            name: userPrimitives.name,
            isActive: userPrimitives.isActive
        });

        const savedDoc = await newUserDoc.save();

        return User.fromPrimitives({
            id: savedDoc._id.toString(),
            email: savedDoc.email,
            password: savedDoc.password,
            name: savedDoc.name,
            isActive: savedDoc.isActive,
            createdAt: savedDoc.createdAt,
            updatedAt: savedDoc.updatedAt
        });

    }

    async findById(id: UserId): Promise<User | null> {
        const userDoc = await UserModel.findById(id.value);

        if (!userDoc) {
            return null;
        }

        return User.fromPrimitives({
            id: userDoc._id.toString(),
            email: userDoc.email,
            password: userDoc.password,
            name: userDoc.name,
            isActive: userDoc.isActive,
            createdAt: userDoc.createdAt,
            updatedAt: userDoc.updatedAt
        });
    }

    async findByEmail(email: UserEmail): Promise<User | null> {
        const userDoc = await UserModel.findOne({ email: email.value });

        if (!userDoc) {
            return null;
        }

        return User.fromPrimitives({
            id: userDoc._id.toString(),
            email: userDoc.email,
            password: userDoc.password,
            name: userDoc.name,
            isActive: userDoc.isActive,
            createdAt: userDoc.createdAt,
            updatedAt: userDoc.updatedAt
        });
    }

    async existsByEmail(email: UserEmail): Promise<boolean> {
        const count = await UserModel.countDocuments({ email: email.value });
        return count > 0;
    }

    async checkAuthentication(id: UserId): Promise<User | null> {
        const user = await this.findById(id);
        if (user) {
            return user;
        }
        return null;
    }
}