import {Authenticator} from './Authenticator';
import {IUserImplicitConfig} from './config/UserImplicitConfig';
import {IHttpClient} from '../../http/HttpClientInterface';
import {OAuthHttpClient} from '../../http/OAuthHttpClient';
import {authDefaults} from './config/Config';
import {TokenStorage} from '../storage/TokenStorage';
import {UserToken} from '../token/UserToken';

class CallbackHashParser {
    private response: {
        access_token?: string,
        expires_in?: number,
        token_type?: string,
        refresh_token?: string
    };

    constructor(s: string) {
        this.response = {};
        if (s[0] === '#') {
            s = s.slice(1);
        }
        s.split('&').map((pair) => {
            const param: string[] = pair.split('=');
            this.response[param[0]] = param[1];
        });
    }

    public getToken(): UserToken {
        return new UserToken(
            this.response.access_token,
            this.response.expires_in,
            this.response.token_type,
            undefined,
            this.response.refresh_token
        );
    }
}

export class UserImplicitAuthenticator extends Authenticator {
    protected config: IUserImplicitConfig;
    protected httpClient: OAuthHttpClient;

    constructor(config: IUserImplicitConfig, storage: TokenStorage) {
        try {
            window.opener['popup_callback'](window.location.hash);
            window.close();
        } catch (err) {
            console.error(err);
        }

        super(config, storage);
        this.httpClient = new OAuthHttpClient(this);
    }

    public init(): Promise<boolean> {
        if (window.opener && window.location.hash) {
            // tslint:disable-next-line:promise-must-complete
            return new Promise<boolean>(() => { return; } );
        }

        return this.loadToken(UserToken)
            .then<boolean>((token) => {
                if (token) {
                    this.httpClient.setAccessToken(token);
                }
                return token ? true : false;
            });
    }

    public authenticate(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const authorizationUrl: string = authDefaults.BASE_URL + authDefaults.AUTHORIZATION_PATH + '?' +
                `response_type=token&client_id=${this.config.clientId}&redirect_uri=${encodeURIComponent(this.config.redirectUri)}`;

            const callback = (hash: string) => {
                const responseParser = new CallbackHashParser(hash);
                const token = responseParser.getToken();
                this.httpClient.setAccessToken(token);
                this.storeToken(token)
                    .then(() => {
                        this.emit('auth.login', token);
                        resolve();
                    })
                    .catch((err) => { reject(err); });
            };

            this.config.popup ? window.open(authorizationUrl, '_blank', 'width=500,height=500,location=0') : window.open(authorizationUrl);
            window['popup_callback'] = callback;
        });
    }

    public getHttpClient(): IHttpClient {
        return this.httpClient;
    }
}
