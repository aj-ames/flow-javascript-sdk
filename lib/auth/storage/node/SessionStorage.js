"use strict";
var SessionStorage = (function () {
    function SessionStorage() {
    }
    SessionStorage.prototype.clear = function () {
        throw new Error('Not implemented');
    };
    SessionStorage.prototype.getItem = function (key) {
        return SessionStorage.storage[key];
    };
    SessionStorage.prototype.key = function (index) {
        throw new Error('Not implemented');
    };
    SessionStorage.prototype.removeItem = function (key) {
        delete SessionStorage.storage[key];
    };
    SessionStorage.prototype.setItem = function (key, data) {
        SessionStorage.storage[key] = data;
    };
    SessionStorage.storage = {};
    return SessionStorage;
}());
exports.SessionStorage = SessionStorage;
//# sourceMappingURL=SessionStorage.js.map