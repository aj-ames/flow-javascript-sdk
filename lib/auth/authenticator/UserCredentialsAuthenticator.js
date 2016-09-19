"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OAuthHttpClient_1 = require('../../http/OAuthHttpClient');
var Config_1 = require('./config/Config');
var UserToken_1 = require('../token/UserToken');
var RefreshableAuthenticator_1 = require('./RefreshableAuthenticator');
var UserCredentialsAuthenticator = (function (_super) {
    __extends(UserCredentialsAuthenticator, _super);
    function UserCredentialsAuthenticator(config, storage) {
        _super.call(this, config, storage);
        this.httpClient = new OAuthHttpClient_1.OAuthHttpClient(this);
    }
    UserCredentialsAuthenticator.prototype.init = function () {
        var _this = this;
        //TODO: try to refresh
        return this.loadToken(UserToken_1.UserToken)
            .then(function (token) {
            if (token) {
                _this.httpClient.setAccessToken(token);
            }
            return token ? true : false;
        });
    };
    UserCredentialsAuthenticator.prototype.authenticate = function () {
        var _this = this;
        var credentials = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            credentials[_i - 0] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            var username = credentials[0];
            var password = credentials[1];
            if (username && password) {
                var requestUrl = Config_1.authDefaults.BASE_URL + Config_1.authDefaults.TOKEN_PATH;
                var payload = {
                    body: ("grant_type=password&client_id=" + _this.config.clientId + "&client_secret=" + _this.config.clientSecret) +
                        ("&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password)),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                };
                _this.httpClient.setAccessToken(null);
                _this.httpClient.post(requestUrl, payload).then(function (response) {
                    if (response.status === 200) {
                        var tokenResponse = JSON.parse(response.body);
                        var token_1 = new UserToken_1.UserToken(tokenResponse.access_token, tokenResponse.expires_in, tokenResponse.token_type, new Date(tokenResponse.created_at * 1000), tokenResponse.refresh_token);
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
            }
            else {
                reject(null);
            }
        });
    };
    UserCredentialsAuthenticator.prototype.getHttpClient = function () {
        return this.httpClient;
    };
    return UserCredentialsAuthenticator;
}(RefreshableAuthenticator_1.RefreshableAuthenticator));
exports.UserCredentialsAuthenticator = UserCredentialsAuthenticator;
//# sourceMappingURL=UserCredentialsAuthenticator.js.map