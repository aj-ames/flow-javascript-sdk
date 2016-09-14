import { Config } from "../auth/authenticator/config/Config";
import { DbApiClient } from "../db/DbApiClient";
import { EventEmitter } from "events";
/**
 * @namespace Scandit.Client
 */
export default class Client extends EventEmitter {
    private authenticator;
    private httpClient;
    private apiClients;
    Db: DbApiClient;
    constructor(config: Config);
    /**
     * Initializes the client
     *
     * @returns {Promise<boolean>}
     */
    init(): Promise<boolean>;
    authenticate(...credentials: string[]): Promise<void>;
}
