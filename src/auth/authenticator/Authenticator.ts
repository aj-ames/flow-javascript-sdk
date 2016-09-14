import {Token} from "../token/Token";
import {HttpClientInterface} from "../../http/HttpClientInterface";
import {TokenStorage} from "../storage/TokenStorage";
import {Config} from "./config/Config";
import {EventEmitter} from "events";
import {setTimeout} from "timers";

export abstract class Authenticator extends EventEmitter {
    protected config: Config;
    protected httpClient: HttpClientInterface;
    protected storage: TokenStorage;
    private tokenWatchTimeout: any;

    constructor(config: Config, storage: TokenStorage) {
        super();
        this.config = config;
        this.storage = storage;
    }

    abstract init(): Promise<boolean>;
    abstract authenticate(...credentials: string[]): Promise<void>;
    abstract getHttpClient(): HttpClientInterface;

    /**
     * Tries to load the token from storage and checks the expiration
     *
     * @param cls Expected type of the token
     * @returns {Promise<Token>}
     */
    protected loadToken(cls: typeof Token): Promise<Token> {
        let loadedToken: Token;
        return this.storage.getToken()
            .then((token) => {
                loadedToken = token;
                if (!token || token.constructor != cls) return false;
                return this.validateToken(token);
            })
            .then((isValid) => {
                if (isValid) {
                    this.watchToken(loadedToken);
                    return loadedToken;
                }
                return false;
            });
    }

    /**
     * Saves token in the storage
     *
     * @param {Token} token
     * @returns {Promise<void>}
     */
    protected storeToken(token: Token): Promise<void> {
        this.emit('auth.update', token);
        this.watchToken(token);
        return this.storage.setToken(token);
    }

    /**
     * Removes saves token
     *
     * @returns {Promise<void>}
     */
    protected logout(): Promise<void> {
        //TODO: revoke token
        this.emit('auth.logout');
        this.unwatchToken();
        return this.storage.clear();
    }

    protected validateToken(token: Token): Promise<boolean> {
        return Promise.resolve<boolean>(!token.isExpired());
    }

    private watchToken(token: Token) {
        this.unwatchToken();
        if (!token || !token.expiresAt) return;
        let diff = (token.expiresAt.getTime() - new Date().getTime());
        this.tokenWatchTimeout = setTimeout(() => {
            this.emit('auth.expire', token);
        }, diff < 0 ? 0 : diff);
    }

    private unwatchToken() {
        if (this.tokenWatchTimeout) {
            clearTimeout(this.tokenWatchTimeout);
            this.tokenWatchTimeout = null;
        }
    }
}