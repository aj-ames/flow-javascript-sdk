"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BrowserStorage_1 = require("./BrowserStorage");
var storage;
if (typeof localStorage !== 'undefined') {
    storage = localStorage;
}
else if (typeof process !== 'undefined') {
    var NodeLocalStorage = require("./node/LocalStorage").LocalStorage;
    storage = new NodeLocalStorage();
}
var LocalStorage = (function (_super) {
    __extends(LocalStorage, _super);
    function LocalStorage(key) {
        if (typeof storage == 'undefined')
            throw new ReferenceError("Local storage is not supported.");
        _super.call(this, storage, key);
    }
    return LocalStorage;
}(BrowserStorage_1.BrowserStorage));
exports.LocalStorage = LocalStorage;
//# sourceMappingURL=LocalStorage.js.map