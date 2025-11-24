export interface JwtPayload {
    userId: string;
    email: string;
}

export interface JwtService {
    generateToken(payload: JwtPayload): Promise<string>;
    verifyToken(token: string): Promise<JwtPayload>;
}