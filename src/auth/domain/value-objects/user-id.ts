import { Types } from 'mongoose';
import { InvalidUserIdError } from '../errors/invalid-user-id.error.js';

export class UserId {
    constructor(public readonly value: string) {
        this.ensureIsValidId(value);
    }

    static fromObjectId(objectId: Types.ObjectId): UserId {
        return new UserId(objectId.toString());
    }

    static generate(): UserId {
        return new UserId(new Types.ObjectId().toString());
    }

    private ensureIsValidId(id: string): void {
        if (!id || typeof id !== 'string') {
            throw new InvalidUserIdError('User ID is required');
        }

        if (!Types.ObjectId.isValid(id)) {
            throw new InvalidUserIdError('User ID must be a valid ObjectId');
        }
    }

    toObjectId(): Types.ObjectId {
        return new Types.ObjectId(this.value);
    }

    equals(other: UserId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}