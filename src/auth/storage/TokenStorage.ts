import {Token} from '../token/Token';
import {UserToken} from '../token/UserToken';
import {ClientToken} from '../token/ClientToken';

export abstract class TokenStorage {
    public abstract getToken(): Promise<Token>;
    public abstract setToken(token: Token): Promise<void>;
    public abstract clear(): Promise<void>;

    public static serializeToken(token: Token): string {
        const tokenJson: any = Object.assign({}, token);
        delete tokenJson.expiresAt;
        tokenJson.createdAt = <number>token.createdAt.getTime();
        tokenJson._cls = token.constructor.name;
        return encodeURIComponent(JSON.stringify(tokenJson));
    }

    public static deserializeToken(value: string): Token {
        const token = JSON.parse(decodeURIComponent(value));
        token.createdAt = new Date(<number>token.createdAt);

        switch (token._cls) {
            case 'UserToken':
                return new UserToken(
                    token.token,
                    <number>token.expires,
                    token.tokenType,
                    token.createdAt,
                    token.refreshToken
                );
            case 'ClientToken':
                return new ClientToken(
                    token.token,
                    <number>token.expires,
                    token.tokenType,
                    token.createdAt,
                    token.refreshToken
                );
            default:
                throw new Error('Invalid token');
        }
    }
}
