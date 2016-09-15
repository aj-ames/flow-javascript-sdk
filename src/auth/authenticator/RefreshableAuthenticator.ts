import {Authenticator} from './Authenticator';
import {Token} from '../token/Token';
import {AuthDefaults} from './config/Config';
import {RequestOptions} from '../../http/HttpClientInterface';
import {ClientConfig} from './config/ClientConfig';

export abstract class RefreshableAuthenticator extends Authenticator {

    protected validateToken(token: Token): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!token.isExpired()) {
                resolve(true);
            } else if (token.isExpired() && token.isRefreshable()) {
                return this.refreshToken(token)
                    .then(() => {
                        resolve(true);
                    })
                    .catch((err) => {
                        console.error(err.stack);
                        reject(false)
                    });
            }
        });
    }

    public refreshToken(token: Token): Promise<void> {
        let requestUrl = AuthDefaults.BASE_URL + AuthDefaults.TOKEN_PATH;
        let payload: RequestOptions = {
            body: `grant_type=refresh_token&client_id=${(<ClientConfig>this.config).clientId}&client_secret=${(<ClientConfig>this.config).clientSecret}&refresh_token=${encodeURIComponent(token.refreshToken)}`,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        return this.httpClient.post(requestUrl, payload).then((response) => {
            if (response.status == 200) {
                let tokenResponse = JSON.parse(response.body);
                token.update(
                    tokenResponse['access_token'],
                    tokenResponse['expires_in'],
                    tokenResponse['token_type'],
                    new Date(tokenResponse['created_at'] * 1000),
                    tokenResponse['refresh_token']
                );
                return this.storeToken(token);
            }
            throw new Error('Authentication failed');
        });
    }

}