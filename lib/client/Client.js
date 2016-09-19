"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Config_1 = require('../auth/authenticator/config/Config');
var ClientAuthenticator_1 = require('../auth/authenticator/ClientAuthenticator');
var UserImplicitAuthenticator_1 = require('../auth/authenticator/UserImplicitAuthenticator');
var UserCredentialsAuthenticator_1 = require('../auth/authenticator/UserCredentialsAuthenticator');
var StaticApiKeyAuthenticator_1 = require('../auth/authenticator/StaticApiKeyAuthenticator');
var DbApiClient_1 = require('../db/DbApiClient');
var CookieStorage_1 = require('../auth/storage/CookieStorage');
var LocalStorage_1 = require('../auth/storage/LocalStorage');
var SessionStorage_1 = require('../auth/storage/SessionStorage');
var events_1 = require('events');
/**
 * @namespace Scandit.Client
 */
var Client = (function (_super) {
    __extends(Client, _super);
    function Client(config) {
        var _this = this;
        _super.call(this);
        var storage;
        switch (config.storage === undefined || config.storage === null ? Config_1.StorageMethod.LOCAL_STORAGE : config.storage) {
            case Config_1.StorageMethod.COOKIE_STORAGE:
                storage = new CookieStorage_1.CookieStorage(config.storageKey);
                break;
            case Config_1.StorageMethod.LOCAL_STORAGE:
                storage = new LocalStorage_1.LocalStorage(config.storageKey);
                break;
            case Config_1.StorageMethod.SESSION_STORAGE:
                storage = new SessionStorage_1.SessionStorage(config.storageKey);
                break;
            case Config_1.StorageMethod.NO_STORAGE:
                storage = null;
                break;
            default:
                throw new ReferenceError('Invalid config provided - unknown storage');
        }
        switch (config.method) {
            case Config_1.AuthMethod.STATIC_KEY:
                this.authenticator = new StaticApiKeyAuthenticator_1.StaticApiKeyAuthenticator(config, storage);
                break;
            case Config_1.AuthMethod.CLIENT:
                this.authenticator = new ClientAuthenticator_1.ClientAuthenticator(config, storage);
                break;
            case Config_1.AuthMethod.USER_IMPLICIT:
                this.authenticator = new UserImplicitAuthenticator_1.UserImplicitAuthenticator(config, storage);
                break;
            case Config_1.AuthMethod.USER_CREDENTIALS:
                this.authenticator = new UserCredentialsAuthenticator_1.UserCredentialsAuthenticator(config, storage);
                break;
            default:
                throw new ReferenceError('Invalid config provided - unknown method');
        }
        this.authenticator.on('auth.login', function (ctx) { _this.emit('auth.login', ctx); });
        this.authenticator.on('auth.logout', function (ctx) { _this.emit('auth.logout', ctx); });
        this.authenticator.on('auth.expire', function (ctx) { _this.emit('auth.expire', ctx); });
        this.authenticator.on('auth.update', function (ctx) { _this.emit('auth.update', ctx); });
        this.Db = new DbApiClient_1.DbApiClient();
        this.apiClients = [
            this.Db
        ];
        this.httpClient = this.authenticator.getHttpClient();
    }
    /**
     * Initializes the client
     *
     * @returns {Promise<boolean>} Promise resolving on successful initialization of the client
     */
    Client.prototype.init = function () {
        var _this = this;
        var isAuthenticated = false;
        return this.authenticator.init()
            .then(function (authStatus) {
            isAuthenticated = authStatus;
            if (!isAuthenticated) {
                return;
            }
            return Promise.all(_this.apiClients.map(function (c) { return c.init(_this.httpClient); }));
        })
            .then(function () {
            _this.emit('init', isAuthenticated);
            return isAuthenticated;
        });
    };
    Client.prototype.authenticate = function () {
        var _this = this;
        var credentials = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            credentials[_i - 0] = arguments[_i];
        }
        if (!this.authenticator) {
            throw new ReferenceError('Provider is not configured.');
        }
        return this.authenticator.authenticate.apply(this.authenticator, credentials)
            .then(function () {
            return _this.init();
        });
    };
    return Client;
}(events_1.EventEmitter));
exports.Client = Client;
//# sourceMappingURL=Client.js.map