import {RequestOptions} from 'http';
import {Authenticator} from './Authenticator';
import {IClientConfig} from './config/ClientConfig';
import {IHttpClient} from '../../http/HttpClientInterface';
import {OAuthHttpClient} from '../../http/OAuthHttpClient';
import {TokenStorage} from '../storage/TokenStorage';
import {authDefaults} from './config/Config';
import {ClientToken} from '../token/ClientToken';

export class ClientAuthenticator extends Authenticator {
    protected config: IClientConfig;
    protected httpClient: OAuthHttpClient;

    constructor(config: IClientConfig, storage: TokenStorage) {
        super(config, storage);
        this.httpClient = new OAuthHttpClient(this);
    }

    public init(): Promise<boolean> {
        //TODO: try to refresh
        return this.loadToken(ClientToken)
            .then<boolean>((token) => {
                if (token) {
                    this.httpClient.setAccessToken(token);
                }
                return token ? true : false;
            });
    }

    public authenticate(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const authenticationUrl = authDefaults.BASE_URL + authDefaults.TOKEN_PATH;
            const payload: RequestOptions = <RequestOptions> {
                body: `grant_type=client_credentials&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };

            this.httpClient.setAccessToken(null);
            this.httpClient.post(authenticationUrl, payload).then(
                (response) => {
                    if (response.status === 200) {
                        const tokenResponse = JSON.parse(response.body);
                        const token = new ClientToken(
                            tokenResponse.access_token,
                            tokenResponse.expires_in,
                            tokenResponse.token_type,
                            new Date(tokenResponse.created_at * 1000),
                            tokenResponse.refresh_token
                        );
                        this.httpClient.setAccessToken(token);
                        this.storeToken(token)
                            .then(() => {
                                this.emit('auth.login', token);
                                resolve();
                            })
                            .catch((err) => { reject(err); });
                    } else {
                        reject(new Error('Authentication failed'));
                    }
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    public getHttpClient(): IHttpClient {
        return this.httpClient;
    }
}
