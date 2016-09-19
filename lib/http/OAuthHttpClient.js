"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HttpClient_1 = require('./HttpClient');
var RefreshableAuthenticator_1 = require('../auth/authenticator/RefreshableAuthenticator');
var OAuthHttpClient = (function (_super) {
    __extends(OAuthHttpClient, _super);
    function OAuthHttpClient(authenticator) {
        _super.call(this);
        this.authenticator = authenticator;
    }
    OAuthHttpClient.prototype.request = function (method, url, options) {
        var _this = this;
        return _super.prototype.request.call(this, method, url, options)
            .catch(function (response) {
            if (response.status === 401 && _this.token && _this.token.isExpired() &&
                _this.token.isRefreshable() && _this.authenticator instanceof RefreshableAuthenticator_1.RefreshableAuthenticator) {
                var token_1 = _this.token;
                _this.token = null;
                return _this.authenticator.refreshToken(token_1)
                    .then(function () {
                    _this.token = token_1;
                    // retry after successful refresh
                    return _super.prototype.request.call(_this, method, url, options);
                });
            }
            return response;
        });
    };
    OAuthHttpClient.prototype.setAccessToken = function (token) {
        this.token = token;
    };
    OAuthHttpClient.prototype.getAuthenticationHeader = function () {
        return this.token ? this.token.tokenType + " " + this.token.token : null;
    };
    OAuthHttpClient.prototype.hasAuthenticationInfo = function () {
        return !!this.token;
    };
    return OAuthHttpClient;
}(HttpClient_1.HttpClient));
exports.OAuthHttpClient = OAuthHttpClient;
//# sourceMappingURL=OAuthHttpClient.js.map