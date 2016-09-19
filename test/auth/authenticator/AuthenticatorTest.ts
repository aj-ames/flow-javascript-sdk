import {Authenticator} from '../../../src/auth/authenticator/Authenticator';
import {IHttpClient} from '../../../src/http/HttpClientInterface';

class TestAuthenticator extends Authenticator {
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

describe('Authenticator', () => {
    let subject = TestAuthenticator;

    describe('#loadToken', () => {
        it('loads token from the storage', () => {
            //TODO
        });

        it('validates the token', () => {
            //TODO
        });

        it('sets token expiration watcher', () => {
            //TODO
        });
    });

    describe('#storeToken', () => {
        it('saves token in the storage', () => {
            //TODO
        });

        it('emits auth.update event', () => {
            //TODO
        });

        it('sets token expiration watcher', () => {
            //TODO
        });
    });

    describe('#logout', () => {
        it('removes token from the storage', () => {
            //TODO
        });

        it('emits auth.logout event', () => {
            //TODO
        });

        it('removes token expiration watcher', () => {
            //TODO
        });
    });

    describe('#watchToken', () => {
        it('watches for token expiration', () => {
            //TODO
        });
    });
});
