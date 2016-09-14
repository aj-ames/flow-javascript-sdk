"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Authenticator_1 = require("./Authenticator");
var Config_1 = require("./config/Config");
var RefreshableAuthenticator = (function (_super) {
    __extends(RefreshableAuthenticator, _super);
    function RefreshableAuthenticator() {
        _super.apply(this, arguments);
    }
    RefreshableAuthenticator.prototype.validateToken = function (token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!token.isExpired()) {
                resolve(true);
            }
            else if (token.isExpired() && token.isRefreshable()) {
                return _this.refreshToken(token)
                    .then(function () {
                    resolve(true);
                })
                    .catch(function (err) {
                    console.error(err.stack);
                    reject(false);
                });
            }
        });
    };
    RefreshableAuthenticator.prototype.refreshToken = function (token) {
        var _this = this;
        var requestUrl = Config_1.AuthDefaults.BASE_URL + Config_1.AuthDefaults.TOKEN_PATH;
        var payload = {
            body: "grant_type=refresh_token&client_id=" + this.config.clientId + "&client_secret=" + this.config.clientSecret + "&refresh_token=" + encodeURIComponent(token.refreshToken),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };
        return this.httpClient.post(requestUrl, payload).then(function (response) {
            if (response.status == 200) {
                var tokenResponse = JSON.parse(response.body);
                token.update(tokenResponse['access_token'], tokenResponse['expires_in'], tokenResponse['token_type'], new Date(tokenResponse['created_at'] * 1000), tokenResponse['refresh_token']);
                return _this.storeToken(token);
            }
            throw new Error('Authentication failed');
        });
    };
    return RefreshableAuthenticator;
}(Authenticator_1.Authenticator));
exports.RefreshableAuthenticator = RefreshableAuthenticator;
//# sourceMappingURL=RefreshableAuthenticator.js.map