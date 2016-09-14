import { TokenStorage } from "./TokenStorage";
import { Token } from "../token/Token";
export declare abstract class BrowserStorage extends TokenStorage {
    private storage;
    private key;
    constructor(storage: Storage, key?: string);
    getToken(): Promise<Token>;
    setToken(token: Token): Promise<void>;
    clear(): Promise<void>;
}
