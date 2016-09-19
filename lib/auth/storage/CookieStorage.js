"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TokenStorage_1 = require('./TokenStorage');
var DEFAULT_COOKIE_NAME = 'scandit_flow';
var CookieStorage = (function (_super) {
    __extends(CookieStorage, _super);
    function CookieStorage(key) {
        if (document === undefined || document.cookie === undefined) {
            throw new ReferenceError('Cookies are not supported.');
        }
        _super.call(this);
        this.key = key || DEFAULT_COOKIE_NAME;
    }
    CookieStorage.prototype.getToken = function () {
        var _this = this;
        var cookie = document.cookie
            .split(';')
            .map(function (x) { return x.split('='); })
            .find(function (x) { return x[0] === _this.key; });
        if (!cookie || cookie[1] === '') {
            return Promise.resolve(null);
        }
        return Promise.resolve(TokenStorage_1.TokenStorage.deserializeToken(cookie[1]));
    };
    CookieStorage.prototype.setToken = function (token) {
        document.cookie = this.key + "=" + TokenStorage_1.TokenStorage.serializeToken(token) + "; SameSite=Strict";
        return Promise.resolve(null);
    };
    CookieStorage.prototype.clear = function () {
        document.cookie = this.key + "=;";
        return Promise.resolve(null);
    };
    return CookieStorage;
}(TokenStorage_1.TokenStorage));
exports.CookieStorage = CookieStorage;
//# sourceMappingURL=CookieStorage.js.map