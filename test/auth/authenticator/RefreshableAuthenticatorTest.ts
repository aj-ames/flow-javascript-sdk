import {RefreshableAuthenticator} from "../../../src/auth/authenticator/RefreshableAuthenticator";
import {HttpClientInterface} from "../../../src/http/HttpClientInterface";

class TestAuthenticator extends RefreshableAuthenticator {
    init(): Promise<boolean> {
        return undefined;
    }

    authenticate(credentials: string): Promise<void> {
        return undefined;
    }

    getHttpClient(): HttpClientInterface {
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