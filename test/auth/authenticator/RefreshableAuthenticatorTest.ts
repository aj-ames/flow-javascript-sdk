import {RefreshableAuthenticator} from '../../../src/auth/authenticator/RefreshableAuthenticator';
import {IHttpClient} from '../../../src/http/HttpClientInterface';

class TestAuthenticator extends RefreshableAuthenticator {
    public init(): Promise<boolean> {
        return undefined;
    }

    public authenticate(credentials: string): Promise<void> {
        return undefined;
    }

    public getHttpClient(): IHttpClient {
        return undefined;
    }

}

describe('RefreshableToken', () => {
    let subject = TestAuthenticator;

    describe('#validateToken', () => {
        it('refreshes token if needed', () => {
            //TODO
        });
    });

    describe('#refreshToken', () => {
        it('refreshes token using grant type refresh_token', () => {
            //TODO
        });

        it('stores new token when successful', () => {
            //TODO
        });
    });
});
