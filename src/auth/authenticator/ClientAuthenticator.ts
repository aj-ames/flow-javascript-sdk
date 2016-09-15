import {RequestOptions} from 'http';
import {Authenticator} from './Authenticator';
import {ClientConfig} from './config/ClientConfig';
import {HttpClientInterface} from '../../http/HttpClientInterface';
import {OAuthHttpClient} from '../../http/OAuthHttpClient';
import {TokenStorage} from '../storage/TokenStorage';
import {AuthDefaults} from './config/Config';
import {ClientToken} from '../token/ClientToken';

export class ClientAuthenticator extends Authenticator {
    protected config: ClientConfig;
    protected httpClient: OAuthHttpClient;

    constructor(config: ClientConfig, storage: TokenStorage) {
        super(config, storage);
        this.httpClient = new OAuthHttpClient(this);
    }

    init(): Promise<boolean> {
        //TODO: try to refresh
        return this.loadToken(ClientToken)
            .then<boolean>((token) => {
                if (token) this.httpClient.setAccessToken(token);
                return token ? true : false;
            });
    }

    authenticate(...credentials: string[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let authenticationUrl = AuthDefaults.BASE_URL + AuthDefaults.TOKEN_PATH;
            let payload: RequestOptions = <RequestOptions> {
                body: `grant_type=client_credentials&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };

            this.httpClient.setAccessToken(null);
            this.httpClient.post(authenticationUrl, payload).then((response) => {
                if (response.status == 200) {
                    let tokenResponse = JSON.parse(response.body);
                    let token = new ClientToken(
                        tokenResponse['access_token'],
                        tokenResponse['expires_in'],
                        tokenResponse['token_type'],
                        new Date(tokenResponse['created_at'] * 1000),
                        tokenResponse['refresh_token']
                    );
                    this.httpClient.setAccessToken(token);
                    this.storeToken(token)
                        .then(() => {
                            this.emit('auth.login', token);
                            resolve();
                        })
                        .catch((err) => {reject(err)});
                } else {
                    reject(new Error('Authentication failed'));
                }
            }, (err) => {
                reject(err);
            });
        });
    }

    getHttpClient(): HttpClientInterface {
        return this.httpClient;
    }
}
