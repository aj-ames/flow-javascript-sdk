import {OAuthHttpClient} from '../../src/http/OAuthHttpClient';

describe('OAuthHttpClient', () => {
    let subject = OAuthHttpClient;

    describe('#request', () => {
        describe('refreshing the token', () => {
            it('refreshes if needed', () => {
                //TODO
            });

            it('refreshes only once', () => {
                //TODO
            });

            it('retries last request after successful refresh', () => {
                //TODO
            });
        });
    });

    describe('#getAuthenticationHeader', () => {
        it('uses token information', () => {
            //TODO
        });

        it('returns null if no token', () => {
            //TODO
        });
    });
});