import {HttpClient} from './HttpClient';
import {Response, RequestOptions} from './HttpClientInterface';
import {Token} from '../auth/token/Token';
import {Authenticator} from '../auth/authenticator/Authenticator';
import {RefreshableAuthenticator} from '../auth/authenticator/RefreshableAuthenticator';


export class OAuthHttpClient extends HttpClient {
    private authenticator: Authenticator;
    private token: Token;

    constructor(authenticator: Authenticator) {
        super();
        this.authenticator = authenticator;
    }

    request(method: string, url: string, options?: RequestOptions): Promise<Response> {
        return super.request(method, url, options)
            .catch((response) => {
                if (response.status == 401 && this.token && this.token.isExpired() && this.token.isRefreshable() && this.authenticator instanceof RefreshableAuthenticator) {
                    let token = this.token;
                    this.token = null;
                    return (<RefreshableAuthenticator> this.authenticator).refreshToken(token)
                        .then(() => {
                            this.token = token;
                            // retry after successful refresh
                            return super.request(method, url, options);
                        });
                }
                return response;
            });
    }

    setAccessToken(token: Token): void {
        this.token = token;
    }

    getAuthenticationHeader(): string {
        return this.token ? `${this.token.tokenType} ${this.token.token}` : null;
    }

    hasAuthenticationInfo(): boolean {
        return !!this.token;
    }

}