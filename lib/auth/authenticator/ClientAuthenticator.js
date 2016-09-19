"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Authenticator_1 = require('./Authenticator');
var OAuthHttpClient_1 = require('../../http/OAuthHttpClient');
var Config_1 = require('./config/Config');
var ClientToken_1 = require('../token/ClientToken');
var ClientAuthenticator = (function (_super) {
    __extends(ClientAuthenticator, _super);
    function ClientAuthenticator(config, storage) {
        _super.call(this, config, storage);
        this.httpClient = new OAuthHttpClient_1.OAuthHttpClient(this);
    }
    ClientAuthenticator.prototype.init = function () {
        var _this = this;
        //TODO: try to refresh
        return this.loadToken(ClientToken_1.ClientToken)
            .then(function (token) {
            if (token) {
                _this.httpClient.setAccessToken(token);
            }
            return token ? true : false;
        });
    };
    ClientAuthenticator.prototype.authenticate = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var authenticationUrl = Config_1.authDefaults.BASE_URL + Config_1.authDefaults.TOKEN_PATH;
            var payload = {
                body: "grant_type=client_credentials&client_id=" + _this.config.clientId + "&client_secret=" + _this.config.clientSecret,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            };
            _this.httpClient.setAccessToken(null);
            _this.httpClient.post(authenticationUrl, payload).then(function (response) {
                if (response.status === 200) {
                    var tokenResponse = JSON.parse(response.body);
                    var token_1 = new ClientToken_1.ClientToken(tokenResponse.access_token, tokenResponse.expires_in, tokenResponse.token_type, new Date(tokenResponse.created_at * 1000), tokenResponse.refresh_token);
                    _this.httpClient.setAccessToken(token_1);
                    _this.storeToken(token_1)
                        .then(function () {
                        _this.emit('auth.login', token_1);
                        resolve();
                    })
                        .catch(function (err) { reject(err); });
                }
                else {
                    reject(new Error('Authentication failed'));
                }
            }, function (err) {
                reject(err);
            });
        });
    };
    ClientAuthenticator.prototype.getHttpClient = function () {
        return this.httpClient;
    };
    return ClientAuthenticator;
}(Authenticator_1.Authenticator));
exports.ClientAuthenticator = ClientAuthenticator;
//# sourceMappingURL=ClientAuthenticator.js.map