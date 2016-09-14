import { Token } from "../token/Token";
import { HttpClientInterface } from "../../http/HttpClientInterface";
import { TokenStorage } from "../storage/TokenStorage";
import { Config } from "./config/Config";
import { EventEmitter } from "events";
export declare abstract class Authenticator extends EventEmitter {
    protected config: Config;
    protected httpClient: HttpClientInterface;
    protected storage: TokenStorage;
    private tokenWatchTimeout;
    constructor(config: Config, storage: TokenStorage);
    abstract init(): Promise<boolean>;
    abstract authenticate(...credentials: string[]): Promise<void>;
    abstract getHttpClient(): HttpClientInterface;
    /**
     * Tries to load the token from storage and checks the expiration
     *
     * @param cls Expected type of the token
     * @returns {Promise<Token>}
     */
    protected loadToken(cls: typeof Token): Promise<Token>;
    /**
     * Saves token in the storage
     *
     * @param {Token} token
     * @returns {Promise<void>}
     */
    protected storeToken(token: Token): Promise<void>;
    /**
     * Removes saves token
     *
     * @returns {Promise<void>}
     */
    protected logout(): Promise<void>;
    protected validateToken(token: Token): Promise<boolean>;
    private watchToken(token);
    private unwatchToken();
}
