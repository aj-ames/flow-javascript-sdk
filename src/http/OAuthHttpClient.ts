import {HttpClient} from './HttpClient';
import {IResponse, IRequestOptions} from './HttpClientInterface';
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

    public request(method: string, url: string, options?: IRequestOptions): Promise<IResponse> {
        return super.request(method, url, options)
            .catch((error) => {
                if (error.response.status === 401 && this.token && this.token.isExpired() &&
                    this.token.isRefreshable() && this.authenticator instanceof RefreshableAuthenticator) {
                    const token = this.token;
                    this.token = null;
                    return (<RefreshableAuthenticator> this.authenticator).refreshToken(token)
                        .then(() => {
                            this.token = token;
                            // retry after successful refresh
                            return super.request(method, url, options);
                        });
                }
                return error;
            });
    }

    public setAccessToken(token: Token): void {
        this.token = token;
    }

    public getAuthenticationHeader(): string {
        return this.token ? `${this.token.tokenType} ${this.token.token}` : null;
    }

    public hasAuthenticationInfo(): boolean {
        return !!this.token;
    }

}
