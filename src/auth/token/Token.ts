export abstract class Token {
    public token: string;
    public expires: number;
    public tokenType: string;
    public createdAt: Date;
    public refreshToken: string;
    public expiresAt: Date;

    constructor(token: string, expires: number, tokenType: string, createdAt?: Date, refreshToken?: string) {
        this.update(token, expires, tokenType, createdAt, refreshToken);
    }

    update(token: string, expires: number, tokenType: string, createdAt?: Date, refreshToken?: string) {
        this.token = token;
        this.createdAt = createdAt ? createdAt : new Date();
        this.expires = expires;
        this.expiresAt = new Date(this.createdAt.getTime() + (expires * 1000));
        this.tokenType = tokenType;
        this.refreshToken = refreshToken;
    }

    isExpired() : boolean {
        return this.expiresAt != null && this.expiresAt < new Date();
    }

    isRefreshable(): boolean {
        return !!this.refreshToken;
    }

}