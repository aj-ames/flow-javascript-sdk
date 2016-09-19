import {IUserCredentialsConfig} from './config/UserCredentialsConfig';
import {OAuthHttpClient} from '../../http/OAuthHttpClient';
import {IHttpClient, IRequestOptions} from '../../http/HttpClientInterface';
import {authDefaults} from './config/Config';
import {TokenStorage} from '../storage/TokenStorage';
import {UserToken} from '../token/UserToken';
import {RefreshableAuthenticator} from './RefreshableAuthenticator';

export class UserCredentialsAuthenticator extends RefreshableAuthenticator {
    protected config: IUserCredentialsConfig;
    protected httpClient: OAuthHttpClient;

    constructor(config: IUserCredentialsConfig, storage: TokenStorage) {
        super(config, storage);
        this.httpClient = new OAuthHttpClient(this);
    }

    public init(): Promise<boolean> {
        //TODO: try to refresh
        return this.loadToken(UserToken)
            .then<boolean>((token) => {
                if (token) {
                    this.httpClient.setAccessToken(token);
                }
                return token ? true : false;
            });
    }

    public authenticate(...credentials: string[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const username: string = credentials[0];
            const password: string = credentials[1];

            if (username && password) {
                const requestUrl = authDefaults.BASE_URL + authDefaults.TOKEN_PATH;
                const payload: IRequestOptions = {
                    body: `grant_type=password&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}` +
                      `&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                };

                this.httpClient.setAccessToken(null);
                this.httpClient.post(requestUrl, payload).then(
                    (response) => {
                        if (response.status === 200) {
                            const tokenResponse = JSON.parse(response.body);
                            const token = new UserToken(
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
                    });
            } else {
                reject(null);
            }
        });
    }

    public getHttpClient(): IHttpClient {
        return this.httpClient;
    }
}
