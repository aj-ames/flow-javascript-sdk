"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BrowserStorage_1 = require("./BrowserStorage");
var storage;
if (typeof sessionStorage !== 'undefined') {
    storage = sessionStorage;
}
else if (typeof process !== 'undefined') {
    var NodeSessionStorage = require("./node/SessionStorage").SessionStorage;
    storage = new NodeSessionStorage();
}
var SessionStorage = (function (_super) {
    __extends(SessionStorage, _super);
    function SessionStorage(key) {
        if (typeof storage == 'undefined')
            throw new ReferenceError("Local storage is not supported.");
        _super.call(this, storage, key);
    }
    return SessionStorage;
}(BrowserStorage_1.BrowserStorage));
exports.SessionStorage = SessionStorage;
//# sourceMappingURL=SessionStorage.js.map