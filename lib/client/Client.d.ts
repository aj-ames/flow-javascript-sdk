import { IConfig } from '../auth/authenticator/config/Config';
import { DbApiClient } from '../db/DbApiClient';
import { EventEmitter } from 'events';
/**
 * @namespace Scandit.Client
 */
export declare class Client extends EventEmitter {
    private authenticator;
    private httpClient;
    private apiClients;
    Db: DbApiClient;
    constructor(config: IConfig);
    /**
     * Initializes the client
     *
     * @returns {Promise<boolean>} Promise resolving on successful initialization of the client
     */
    init(): Promise<boolean>;
    authenticate(...credentials: string[]): Promise<void>;
}
