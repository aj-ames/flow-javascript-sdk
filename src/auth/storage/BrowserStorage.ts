import {TokenStorage} from "./TokenStorage";
import {Token} from "../token/Token";

const DEFAULT_STORAGE_KEY = "scandit_flow";

export abstract class BrowserStorage extends TokenStorage {
    private storage: Storage;
    private key: string;

    public constructor(storage: Storage, key?: string) {
        super();
        this.key = key || DEFAULT_STORAGE_KEY;
        this.storage = storage;
    }

    getToken(): Promise<Token> {
        var token = this.storage.getItem(this.key);
        if (!token) return Promise.resolve<Token>(null);
        return Promise.resolve<Token>(TokenStorage.deserializeToken(token));
    }

    setToken(token: Token): Promise<void> {
        this.storage.setItem(this.key, TokenStorage.serializeToken(token));
        return Promise.resolve<void>(null);
    }

    clear(): Promise<void> {
        this.storage.removeItem(this.key);
        return Promise.resolve<void>(null);
    }
}