export class InvalidUserEmailError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidUserEmailError';
    }
}