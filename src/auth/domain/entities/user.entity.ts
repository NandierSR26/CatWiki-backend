import { UserEmail } from '../value-objects/user-email.js';
import { UserPassword } from '../value-objects/user-password.js';
import { UserId } from '../value-objects/user-id.js';

export interface UserProps {
    id?: UserId;
    email: UserEmail;
    password: UserPassword;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class User {
    private constructor(private readonly props: UserProps) { }

    static create(
        email: UserEmail,
        password: UserPassword,
        name: string,
    ): User {
        const now = new Date();
        return new User({
            email,
            password,
            name,
            isActive: true,
            createdAt: now,
            updatedAt: now,
        });
    }

    static fromPrimitives(props: {
        id: string;
        email: string;
        password: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }): User {
        return new User({
            id: new UserId(props.id),
            email: new UserEmail(props.email),
            password: new UserPassword(props.password),
            name: props.name,
            isActive: props.isActive,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        });
    }

    get id(): UserId | undefined {
        return this.props.id;
    }

    get email(): UserEmail {
        return this.props.email;
    }

    get password(): UserPassword {
        return this.props.password;
    }

    get name(): string {
        return this.props.name;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    updatePassword(newPassword: UserPassword): void {
        this.props.password = newPassword;
        this.props.updatedAt = new Date();
    }

    deactivate(): void {
        this.props.isActive = false;
        this.props.updatedAt = new Date();
    }

    activate(): void {
        this.props.isActive = true;
        this.props.updatedAt = new Date();
    }

    toPrimitives() {
        return {
            id: this.props.id?.value,
            email: this.props.email.value,
            password: this.props.password.value,
            name: this.props.name,
            isActive: this.props.isActive,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}