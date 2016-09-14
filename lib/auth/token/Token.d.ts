export declare abstract class Token {
    token: string;
    expires: number;
    tokenType: string;
    createdAt: Date;
    refreshToken: string;
    expiresAt: Date;
    constructor(token: string, expires: number, tokenType: string, createdAt?: Date, refreshToken?: string);
    update(token: string, expires: number, tokenType: string, createdAt?: Date, refreshToken?: string): void;
    isExpired(): boolean;
    isRefreshable(): boolean;
}
