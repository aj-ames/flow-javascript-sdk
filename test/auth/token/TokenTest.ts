import {UserToken} from '../../../src/auth/token/UserToken';

describe('Token', () => {
    let testToken = new UserToken('testtoken', 1000, 'bearer', new Date(1473431171404), 'testrefreshtoken');

    describe('#isExpired', () => {
        it('checks token expiresAt', () => {
            testToken.expiresAt = new Date((new Date().getTime() - 1));
            testToken.isExpired().should.be.true;
            testToken.expiresAt = new Date((new Date().getTime() + 1));
            testToken.isExpired().should.be.false;
        });

        it('token without expiresAt never expires', () => {
            testToken.expiresAt = null;
            testToken.isExpired().should.be.false;
        });
    });

    describe('#isRefreshable', () => {
        it('checks if refresh token is present', () => {
            testToken.refreshToken = null;
            testToken.isRefreshable().should.be.false;
            testToken.refreshToken = 'testrefreshtoken';
            testToken.isRefreshable().should.be.true;
        });
    });

});