import {TokenStorage} from './TokenStorage';
import {Token} from '../token/Token';

const DEFAULT_COOKIE_NAME = 'scandit_flow';

export class CookieStorage extends TokenStorage {
    private key: string;

    constructor(key?: string) {
        if (document === undefined || document.cookie === undefined) {
            throw new ReferenceError('Cookies are not supported.');
        }
        super();
        this.key = key || DEFAULT_COOKIE_NAME;
    }

    public getToken(): Promise<Token> {
        const cookie = document.cookie
            .split(';')
            .map((x) => { return x.split('='); })
            .find((x) => { return x[0] === this.key; });
        if (!cookie || cookie[1] === '') {
            return Promise.resolve<Token>(null);
        }
        return Promise.resolve<Token>(TokenStorage.deserializeToken(cookie[1]));
    }

    public setToken(token: Token): Promise<void> {
        document.cookie = `${this.key}=${TokenStorage.serializeToken(token)}; SameSite=Strict`;
        return Promise.resolve<void>(null);
    }

    public clear(): Promise<void> {
        document.cookie = `${this.key}=;`;
        return Promise.resolve<void>(null);
    }
}
