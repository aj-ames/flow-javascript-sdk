import {SessionStorage} from '../../../src/auth/storage/SessionStorage';
import {LocalStorage} from '../../../src/auth/storage/LocalStorage';
import {CookieStorage} from '../../../src/auth/storage/CookieStorage';
import {UserToken} from '../../../src/auth/token/UserToken';
import {TokenStorage} from '../../../src/auth/storage/TokenStorage';

const subjects = [
    CookieStorage,
    LocalStorage,
    SessionStorage,
];

subjects.forEach((subjectCls) => {
    describe(`auth.storage.${subjectCls['name']}`, () => {
        let subject: TokenStorage = new subjectCls();
        let testToken = new UserToken('testtoken', 1000, 'bearer', new Date(1473431171404), 'testrefreshtoken');

        it('stores the token and allows to retrieve it', () => {
            return subject.setToken(testToken)
                .then(() => {
                    return subject.getToken();
                }).should.eventually.eql(testToken);
        });

        it('returns null if token doesn\'t exist', () => {
            return subject.clear()
                .then(() => {
                    return subject.getToken();
                }).should.eventually.eql(null);
        });
    });

});
