"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Authenticator_1 = require('./Authenticator');
var HttpClient_1 = require('../../http/HttpClient');
var StaticApiKeyAuthenticator = (function (_super) {
    __extends(StaticApiKeyAuthenticator, _super);
    function StaticApiKeyAuthenticator(config, storage) {
        _super.call(this, config, storage);
        this.httpClient = new HttpClient_1.HttpClient();
    }
    StaticApiKeyAuthenticator.prototype.init = function () {
        this.httpClient.setAuthenticationHeader(this.config.key);
        return Promise.resolve(true);
    };
    StaticApiKeyAuthenticator.prototype.authenticate = function () {
        return Promise.resolve(null);
    };
    StaticApiKeyAuthenticator.prototype.getHttpClient = function () {
        return this.httpClient;
    };
    return StaticApiKeyAuthenticator;
}(Authenticator_1.Authenticator));
exports.StaticApiKeyAuthenticator = StaticApiKeyAuthenticator;
//# sourceMappingURL=StaticApiKeyAuthenticator.js.map