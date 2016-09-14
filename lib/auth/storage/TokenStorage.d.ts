import { Token } from "../token/Token";
export declare abstract class TokenStorage {
    abstract getToken(): Promise<Token>;
    abstract setToken(token: Token): Promise<void>;
    abstract clear(): Promise<void>;
    static serializeToken(token: Token): string;
    static deserializeToken(value: string): Token;
}
