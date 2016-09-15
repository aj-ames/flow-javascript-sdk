import * as jsverify from 'jsverify';
import {TokenStorage} from '../../../src/auth/storage/TokenStorage';
import {UserToken} from '../../../src/auth/token/UserToken';
import {ClientToken} from '../../../src/auth/token/ClientToken';

describe('auth.storage.TokenStorage', () => {
    let testToken = new UserToken('testtoken', 1000, 'bearer', new Date(1473431171404), 'testrefreshtoken');
    let testTokenJson = '{"token":"testtoken","createdAt":1473431171404,"expires":1000,"tokenType":"bearer","refreshToken":"testrefreshtoken","_cls":"UserToken"}';
    let testTokenSerialized = '%7B%22token%22%3A%22testtoken%22%2C%22createdAt%22%3A1473431171404%2C%22expires%22%3A1000%2C%22tokenType%22%3A%22bearer%22%2C%22refreshToken%22%3A%22testrefreshtoken%22%2C%22_cls%22%3A%22UserToken%22%7D';

    describe('.serializeToken', () => {
        it('serializes the token', () => {
            TokenStorage.serializeToken(testToken).should.eql(testTokenSerialized);
        });

        it('works with all kind of input', () => {
            jsverify.assert(jsverify.forall(jsverify.nestring, jsverify.uint16, jsverify.nestring, jsverify.uint32, jsverify.string, (token, expires, type, createdAt, refreshToken) => {
                let t = new UserToken(token, expires, type, new Date(createdAt), refreshToken == '' ? null : refreshToken);
                let result = TokenStorage.serializeToken(t);
                return result && result.length > 0;
            }))
        });
    });

    describe('.deserializeToken', () => {
        it('deserializes the token', () => {
            TokenStorage.deserializeToken(testTokenSerialized).should.eql(testToken);
        });

        it('uses class information for token type', () => {
            let userToken = new UserToken('testtoken', 1000, 'bearer', new Date(1473431171404), 'testrefreshtoken');
            TokenStorage.deserializeToken(TokenStorage.serializeToken(userToken))
                .should.be.an.instanceOf(UserToken);

            let clientToken = new ClientToken('testtoken', 1000, 'bearer', new Date(1473431171404), 'testrefreshtoken');
            TokenStorage.deserializeToken(TokenStorage.serializeToken(clientToken))
                .should.be.an.instanceOf(ClientToken);
        });

        it('fails if class information is invalid', () => {
            let s = '%7B%22token%22%3A%22testtoken%22%2C%22createdAt%22%3A1473431171404%2C%22expires%22%3A1000%2C%22tokenType%22%3A%22bearer%22%2C%22refreshToken%22%3A%22testrefreshtoken%22%2C%22_cls%22%3A%22InvalidClass%22%7D';

            // Workaround, chai should.throw doesn't work
            let failed = false;
            try {
                TokenStorage.deserializeToken(s);
            } catch (e) {
                failed = true;
            } finally {
                failed.should.be.true;
            }

        });
    });

});