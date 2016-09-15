import {UserCredentialsAuthenticator} from '../../../src/auth/authenticator/UserCredentialsAuthenticator';

describe('UserCredentialsAuthenticator', () => {
    let subject = UserCredentialsAuthenticator;

    describe('#init', () => {
        it('sets token on the http client', () => {
            //TODO
        });
    });

    describe('#authenticate', () => {
        it('authenticates using grant type password', () => {
            //TODO
        });

        describe('successful authentication', () => {
            it('sets token on the http client', () => {
                //TODO
            });

            it('stores token in the storage', () => {
                //TODO
            });

            it('emits auth.login event', () => {
                //TODO
            });
        });

        describe('failed authentication', () => {
            it('call fails with error', () => {
                //TODO
            });

            it('http client has no token', () => {
                //TODO
            });

            it('token is removed from storage', () => {
                //TODO
            });
        });
    });
});