"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Authenticator_1 = require('./Authenticator');
var OAuthHttpClient_1 = require('../../http/OAuthHttpClient');
var Config_1 = require('./config/Config');
var UserToken_1 = require('../token/UserToken');
var CallbackHashParser = (function () {
    function CallbackHashParser(s) {
        var _this = this;
        this.response = {};
        if (s[0] === '#') {
            s = s.slice(1);
        }
        s.split('&').map(function (pair) {
            var param = pair.split('=');
            _this.response[param[0]] = param[1];
        });
    }
    CallbackHashParser.prototype.getToken = function () {
        return new UserToken_1.UserToken(this.response.access_token, this.response.expires_in, this.response.token_type, undefined, this.response.refresh_token);
    };
    return CallbackHashParser;
}());
var UserImplicitAuthenticator = (function (_super) {
    __extends(UserImplicitAuthenticator, _super);
    function UserImplicitAuthenticator(config, storage) {
        _super.call(this, config, storage);
        this.httpClient = new OAuthHttpClient_1.OAuthHttpClient(this);
    }
    UserImplicitAuthenticator.prototype.init = function () {
        var _this = this;
        if (window.opener && window.location.hash) {
            try {
                window.onload(null);
                window['response_callback'](window.location.hash);
                window.close();
            }
            catch (err) {
                console.error(err);
            }
            // tslint:disable-next-line:promise-must-complete
            return new Promise(function () { return; });
        }
        //TODO: try to refresh
        return this.loadToken(UserToken_1.UserToken)
            .then(function (token) {
            if (token) {
                _this.httpClient.setAccessToken(token);
            }
            return token ? true : false;
        });
    };
    UserImplicitAuthenticator.prototype.authenticate = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var authorizationUrl = Config_1.authDefaults.BASE_URL + Config_1.authDefaults.AUTHORIZATION_PATH + '?' +
                ("response_type=token&client_id=" + _this.config.clientId + "&redirect_uri=" + encodeURIComponent(_this.config.redirectUri));
            var callback = function (hash) {
                var responseParser = new CallbackHashParser(hash);
                var token = responseParser.getToken();
                _this.httpClient.setAccessToken(token);
                _this.storeToken(token)
                    .then(function () {
                    _this.emit('auth.login', token);
                    resolve();
                })
                    .catch(function (err) { reject(err); });
            };
            var popup = _this.config.popup ? window.open(authorizationUrl, '_blank', 'width=500,height=500,location=0') : window.open(authorizationUrl);
            popup.onload = function () {
                popup.response_callback = callback;
            };
            popup.onbeforeunload = function () {
                reject();
            };
        });
    };
    UserImplicitAuthenticator.prototype.getHttpClient = function () {
        return this.httpClient;
    };
    return UserImplicitAuthenticator;
}(Authenticator_1.Authenticator));
exports.UserImplicitAuthenticator = UserImplicitAuthenticator;
//# sourceMappingURL=UserImplicitAuthenticator.js.map