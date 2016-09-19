import {IConfig, AuthMethod, StorageMethod} from '../auth/authenticator/config/Config';
import {IClientConfig} from '../auth/authenticator/config/ClientConfig';
import {ClientAuthenticator} from '../auth/authenticator/ClientAuthenticator';
import {IUserImplicitConfig} from '../auth/authenticator/config/UserImplicitConfig';
import {IUserCredentialsConfig} from '../auth/authenticator/config/UserCredentialsConfig';
import {UserImplicitAuthenticator} from '../auth/authenticator/UserImplicitAuthenticator';
import {UserCredentialsAuthenticator} from '../auth/authenticator/UserCredentialsAuthenticator';
import {Authenticator} from '../auth/authenticator/Authenticator';
import {IHttpClient} from '../http/HttpClientInterface';
import {StaticApiKeyAuthenticator} from '../auth/authenticator/StaticApiKeyAuthenticator';
import {IStaticKeyConfig} from '../auth/authenticator/config/StaticKeyConfig';
import {DbApiClient} from '../db/DbApiClient';
import {IApiClient} from './ApiClientInterface';
import {CookieStorage} from '../auth/storage/CookieStorage';
import {LocalStorage} from '../auth/storage/LocalStorage';
import {SessionStorage} from '../auth/storage/SessionStorage';
import {TokenStorage} from '../auth/storage/TokenStorage';
import {EventEmitter} from 'events';

/**
 * @namespace Scandit.Client
 */

export class Client extends EventEmitter {
    private authenticator: Authenticator;
    private httpClient: IHttpClient;
    private apiClients: IApiClient[];

    // tslint:disable-next-line:variable-name
    public Db: DbApiClient;

    constructor(config: IConfig) {
        super();
        let storage: TokenStorage;
        switch (config.storage === undefined || config.storage === null ? StorageMethod.LOCAL_STORAGE : config.storage) {
            case StorageMethod.COOKIE_STORAGE:
                storage = new CookieStorage(config.storageKey);
                break;
            case StorageMethod.LOCAL_STORAGE:
                storage = new LocalStorage(config.storageKey);
                break;
            case StorageMethod.SESSION_STORAGE:
                storage = new SessionStorage(config.storageKey);
                break;
            case StorageMethod.NO_STORAGE:
                storage = null;
                break;
            default:
                throw new ReferenceError('Invalid config provided - unknown storage');
        }

        switch (config.method) {
            case AuthMethod.STATIC_KEY:
                this.authenticator = new StaticApiKeyAuthenticator(<IStaticKeyConfig>config, storage);
                break;
            case AuthMethod.CLIENT:
                this.authenticator = new ClientAuthenticator(<IClientConfig>config, storage);
                break;
            case AuthMethod.USER_IMPLICIT:
                this.authenticator = new UserImplicitAuthenticator(<IUserImplicitConfig>config, storage);
                break;
            case AuthMethod.USER_CREDENTIALS:
                this.authenticator = new UserCredentialsAuthenticator(<IUserCredentialsConfig>config, storage);
                break;
            default:
                throw new ReferenceError('Invalid config provided - unknown method');
        }

        this.authenticator.on('auth.login', (ctx) => { this.emit('auth.login', ctx); });
        this.authenticator.on('auth.logout', (ctx) => { this.emit('auth.logout', ctx); });
        this.authenticator.on('auth.expire', (ctx) => { this.emit('auth.expire', ctx); });
        this.authenticator.on('auth.update', (ctx) => { this.emit('auth.update', ctx); });

        this.Db = new DbApiClient();
        this.apiClients = [
            this.Db
        ];
        this.httpClient = this.authenticator.getHttpClient();
    }

    /**
     * Initializes the client
     *
     * @returns {Promise<boolean>} Promise resolving on successful initialization of the client
     */
    public init(): Promise<boolean> {
        let isAuthenticated = false;
        return this.authenticator.init()
            .then((authStatus) => {
                isAuthenticated = authStatus;
                if (!isAuthenticated) {
                    return;
                }
                return Promise.all(this.apiClients.map((c) => { return c.init(this.httpClient); }));
            })
            .then(() => {
                this.emit('init', isAuthenticated);
                return isAuthenticated;
            });
    }

    public authenticate(...credentials: string[]): Promise<void> {
        if (!this.authenticator) {
            throw new ReferenceError('Provider is not configured.');
        }
        return this.authenticator.authenticate.apply(this.authenticator, credentials)
            .then(() => {
                return this.init();
            });
    }

}
