"use strict";
var Token = (function () {
    function Token(token, expires, tokenType, createdAt, refreshToken) {
        this.update(token, expires, tokenType, createdAt, refreshToken);
    }
    Token.prototype.update = function (token, expires, tokenType, createdAt, refreshToken) {
        this.token = token;
        this.createdAt = createdAt ? createdAt : new Date();
        this.expires = expires;
        this.expiresAt = new Date(this.createdAt.getTime() + (expires * 1000));
        this.tokenType = tokenType;
        this.refreshToken = refreshToken;
    };
    Token.prototype.isExpired = function () {
        return this.expiresAt != null && this.expiresAt < new Date();
    };
    Token.prototype.isRefreshable = function () {
        return !!this.refreshToken;
    };
    return Token;
}());
exports.Token = Token;
//# sourceMappingURL=Token.js.map