import {Authenticator} from './Authenticator';
import {UserImplicitConfig} from './config/UserImplicitConfig';
import {HttpClientInterface} from '../../http/HttpClientInterface';
import {OAuthHttpClient} from '../../http/OAuthHttpClient';
import {AuthDefaults} from './config/Config';
import {TokenStorage} from '../storage/TokenStorage';
import {UserToken} from '../token/UserToken';

class CallbackHashParser {
    private response: Object;

    constructor(s: string) {
        this.response = {};
        if(s[0] == "#") s = s.slice(1);
        s.split("&").map((pair) => {
            let param: string[] = pair.split("=");
            this.response[param[0]] = param[1]
        });
    }

    public getToken(): UserToken {
        return new UserToken(
            this.response['access_token'],
            this.response['expires_in'],
            this.response['token_type'],
            this.response['refresh_token']
        )
    }
}

export class UserImplicitAuthenticator extends Authenticator {
    protected config: UserImplicitConfig;
    protected httpClient: OAuthHttpClient;

    constructor(config: UserImplicitConfig, storage: TokenStorage) {
        super(config, storage);
        this.httpClient = new OAuthHttpClient(this);
    }

    init(): Promise<boolean> {
        if(window.opener && window.location.hash) {
            try {
                window.onload(null);
                window['response_callback'](window.location.hash);
                window.close();
            } catch (err) {
                console.error(err);
            }
            return new Promise<boolean>(() => {});
        }

        //TODO: try to refresh
        return this.loadToken(UserToken)
            .then<boolean>((token) => {
                if (token) this.httpClient.setAccessToken(token);
                return token ? true : false;
            });
    }

    authenticate(...credentials: string[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let authorizationUrl: string = AuthDefaults.BASE_URL + AuthDefaults.AUTHORIZATION_PATH + "?" +
                `response_type=token&client_id=${this.config.clientId}&redirect_uri=${encodeURIComponent(this.config.redirectUri)}`;

            let callback = (hash: string) => {
                let responseParser = new CallbackHashParser(hash);
                let token = responseParser.getToken();
                this.httpClient.setAccessToken(token);
                this.storeToken(token)
                    .then(() => {
                        this.emit('auth.login', token);
                        resolve();
                    })
                    .catch((err) => {reject(err)});
            };

            let popup: any = this.config.popup ? window.open(authorizationUrl, "_blank", "width=500,height=500,location=0") : window.open(authorizationUrl);
            popup.onload = function() {
                popup.response_callback = callback;
            };
            popup.onbeforeunload = function() {
                reject();
            };
        });
    }

    getHttpClient(): HttpClientInterface {
        return this.httpClient;
    }

    // This can be moved to some separate class because it's also used in popup gateway
}