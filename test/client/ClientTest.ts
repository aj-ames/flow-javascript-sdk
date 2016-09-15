import Client from '../../src/client/Client';

describe('client.Client', () => {
    let subject = Client;

    describe('constructor', () => {
        describe('storage configuration', () => {
            it('allows to select storage', () => {

            });

            it('uses local storage by default', () => {

            });
        });

        describe('authenticator configuration', () => {
            it('requires to select authentication method', () => {

            });
        });
    });

    describe('#init', () => {
        it('returns status of the authentication', () => {

        });

        it('inits the api clients', () => {

        });

        it('inits the api clients only if authenticated', () => {

        });

        it('emits init event', () => {

        });
    });

    describe('#authenticate', () => {
        it('inits the api clients after successful authentication', () => {
            //TODO
        });

        it('passes credentials to the authenticator', () => {
            //TODO
        });
    });

    describe('events', () => {
        it('forwards authenticator events', () => {

        });
    });
});