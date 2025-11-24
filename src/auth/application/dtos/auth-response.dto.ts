export interface AuthResponseDto {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}