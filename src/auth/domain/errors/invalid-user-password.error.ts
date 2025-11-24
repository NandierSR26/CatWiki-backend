export class InvalidUserPasswordError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidUserPasswordError';
    }
}