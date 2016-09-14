"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TokenStorage_1 = require("./TokenStorage");
var DEFAULT_STORAGE_KEY = "scandit_flow";
var BrowserStorage = (function (_super) {
    __extends(BrowserStorage, _super);
    function BrowserStorage(storage, key) {
        _super.call(this);
        this.key = key || DEFAULT_STORAGE_KEY;
        this.storage = storage;
    }
    BrowserStorage.prototype.getToken = function () {
        var token = this.storage.getItem(this.key);
        if (!token)
            return Promise.resolve(null);
        return Promise.resolve(TokenStorage_1.TokenStorage.deserializeToken(token));
    };
    BrowserStorage.prototype.setToken = function (token) {
        this.storage.setItem(this.key, TokenStorage_1.TokenStorage.serializeToken(token));
        return Promise.resolve(null);
    };
    BrowserStorage.prototype.clear = function () {
        this.storage.removeItem(this.key);
        return Promise.resolve(null);
    };
    return BrowserStorage;
}(TokenStorage_1.TokenStorage));
exports.BrowserStorage = BrowserStorage;
//# sourceMappingURL=BrowserStorage.js.map