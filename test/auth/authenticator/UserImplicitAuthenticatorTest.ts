import {UserImplicitAuthenticator} from "../../../src/auth/authenticator/UserImplicitAuthenticator";

describe('UserImplicitAuthenticator', () => {
    let subject = UserImplicitAuthenticator;

    describe('#init', () => {
        describe('in the auth window', () => {
            it('parses the hash and calls response_callback', () => {
                //TODO
            });

            it('stores the token in the storage', () => {
                //TODO
            });

            it('closes the auth window', () => {
                //TODO
            });
        });

        describe('not in the auth window', () => {
            it('loads token from the storage', () => {
                //TODO
            });

            it('sets token on the http client', () => {
                //TODO
            });
        });
    });

    describe('#authenticate', () => {
        it('opens popup with authorization url', () => {
            //TODO
        });

        it('opens new window with authorization url', () => {
            //TODO
        });

        it('authentication fails when auth window is closed', () => {
            //TODO
        });
    });
});