"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BrowserStorage_1 = require('./BrowserStorage');
var NodeLocalStorage_1 = require('./node/NodeLocalStorage');
var storage;
if (window !== undefined && window.localStorage !== undefined) {
    storage = window.localStorage;
}
else if (process !== undefined) {
    storage = new NodeLocalStorage_1.NodeLocalStorage();
}
var LocalStorage = (function (_super) {
    __extends(LocalStorage, _super);
    function LocalStorage(key) {
        if (storage === undefined) {
            throw new ReferenceError('Local storage is not supported.');
        }
        _super.call(this, storage, key);
    }
    return LocalStorage;
}(BrowserStorage_1.BrowserStorage));
exports.LocalStorage = LocalStorage;
//# sourceMappingURL=LocalStorage.js.map