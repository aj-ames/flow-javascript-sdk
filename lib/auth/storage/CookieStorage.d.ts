import { TokenStorage } from './TokenStorage';
import { Token } from '../token/Token';
export declare class CookieStorage extends TokenStorage {
    private key;
    constructor(key?: string);
    getToken(): Promise<Token>;
    setToken(token: Token): Promise<void>;
    clear(): Promise<void>;
}
