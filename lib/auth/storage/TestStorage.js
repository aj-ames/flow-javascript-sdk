"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TokenStorage_1 = require("./TokenStorage");
var TestStorage = (function (_super) {
    __extends(TestStorage, _super);
    function TestStorage() {
        _super.apply(this, arguments);
    }
    TestStorage.prototype.getToken = function () {
        return null;
    };
    TestStorage.prototype.setToken = function (token) {
        return null;
    };
    TestStorage.prototype.clear = function () {
        return null;
    };
    return TestStorage;
}(TokenStorage_1.TokenStorage));
exports.TestStorage = TestStorage;
//# sourceMappingURL=TestStorage.js.map