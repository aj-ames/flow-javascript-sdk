"use strict";
var UserToken_1 = require("../token/UserToken");
var ClientToken_1 = require("../token/ClientToken");
var TokenStorage = (function () {
    function TokenStorage() {
    }
    TokenStorage.serializeToken = function (token) {
        var tokenJson = Object.assign({}, token);
        delete tokenJson.expiresAt;
        tokenJson.createdAt = token.createdAt.getTime();
        tokenJson._cls = token.constructor.name;
        return encodeURIComponent(JSON.stringify(tokenJson));
    };
    TokenStorage.deserializeToken = function (value) {
        var token = JSON.parse(decodeURIComponent(value));
        token.createdAt = new Date(token['createdAt']);
        switch (token._cls) {
            case 'UserToken':
                return new UserToken_1.UserToken(token.token, token.expires, token.tokenType, token.createdAt, token.refreshToken);
            case 'ClientToken':
                return new ClientToken_1.ClientToken(token.token, token.expires, token.tokenType, token.createdAt, token.refreshToken);
            default:
                throw new Error('Invalid token');
        }
    };
    return TokenStorage;
}());
exports.TokenStorage = TokenStorage;
//# sourceMappingURL=TokenStorage.js.map