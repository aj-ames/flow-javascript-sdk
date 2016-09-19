import { Token } from '../token/Token';
import { IHttpClient } from '../../http/HttpClientInterface';
import { TokenStorage } from '../storage/TokenStorage';
import { IConfig } from './config/Config';
import { EventEmitter } from 'events';
export declare abstract class Authenticator extends EventEmitter {
    protected config: IConfig;
    protected httpClient: IHttpClient;
    protected storage: TokenStorage;
    private tokenWatchTimeout;
    constructor(config: IConfig, storage: TokenStorage);
    abstract init(): Promise<boolean>;
    abstract authenticate(...credentials: string[]): Promise<void>;
    abstract getHttpClient(): IHttpClient;
    /**
     * Tries to load the token from storage and checks the expiration
     *
     * @param {Token} cls Expected type of the token
     * @returns {Promise<Token>} Promise resolving to the loaded token
     */
    protected loadToken(cls: typeof Token): Promise<Token>;
    /**
     * Saves token in the storage
     *
     * @param {Token} token Token to be saved
     * @returns {Promise<void>} Promise resolving on successful storage of token
     */
    protected storeToken(token: Token): Promise<void>;
    /**
     * Removes saves token
     *
     * @returns {Promise<void>} Promise resolving on successful removal of token
     */
    protected logout(): Promise<void>;
    protected validateToken(token: Token): Promise<boolean>;
    private watchToken(token);
    private unwatchToken();
}
