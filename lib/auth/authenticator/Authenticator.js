"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require("events");
var timers_1 = require("timers");
var Authenticator = (function (_super) {
    __extends(Authenticator, _super);
    function Authenticator(config, storage) {
        _super.call(this);
        this.config = config;
        this.storage = storage;
    }
    /**
     * Tries to load the token from storage and checks the expiration
     *
     * @param cls Expected type of the token
     * @returns {Promise<Token>}
     */
    Authenticator.prototype.loadToken = function (cls) {
        var _this = this;
        var loadedToken;
        return this.storage.getToken()
            .then(function (token) {
            loadedToken = token;
            if (!token || token.constructor != cls)
                return false;
            return _this.validateToken(token);
        })
            .then(function (isValid) {
            if (isValid) {
                _this.watchToken(loadedToken);
                return loadedToken;
            }
            return false;
        });
    };
    /**
     * Saves token in the storage
     *
     * @param {Token} token
     * @returns {Promise<void>}
     */
    Authenticator.prototype.storeToken = function (token) {
        this.emit('auth.update', token);
        this.watchToken(token);
        return this.storage.setToken(token);
    };
    /**
     * Removes saves token
     *
     * @returns {Promise<void>}
     */
    Authenticator.prototype.logout = function () {
        //TODO: revoke token
        this.emit('auth.logout');
        this.unwatchToken();
        return this.storage.clear();
    };
    Authenticator.prototype.validateToken = function (token) {
        return Promise.resolve(!token.isExpired());
    };
    Authenticator.prototype.watchToken = function (token) {
        var _this = this;
        this.unwatchToken();
        if (!token || !token.expiresAt)
            return;
        var diff = (token.expiresAt.getTime() - new Date().getTime());
        this.tokenWatchTimeout = timers_1.setTimeout(function () {
            _this.emit('auth.expire', token);
        }, diff < 0 ? 0 : diff);
    };
    Authenticator.prototype.unwatchToken = function () {
        if (this.tokenWatchTimeout) {
            clearTimeout(this.tokenWatchTimeout);
            this.tokenWatchTimeout = null;
        }
    };
    return Authenticator;
}(events_1.EventEmitter));
exports.Authenticator = Authenticator;
//# sourceMappingURL=Authenticator.js.map