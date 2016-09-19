"use strict";
var NodeSessionStorage = (function () {
    function NodeSessionStorage() {
    }
    NodeSessionStorage.prototype.clear = function () {
        throw new Error('Not implemented');
    };
    NodeSessionStorage.prototype.getItem = function (key) {
        return NodeSessionStorage.storage[key];
    };
    NodeSessionStorage.prototype.key = function () {
        throw new Error('Not implemented');
    };
    NodeSessionStorage.prototype.removeItem = function (key) {
        delete NodeSessionStorage.storage[key];
    };
    NodeSessionStorage.prototype.setItem = function (key, data) {
        NodeSessionStorage.storage[key] = data;
    };
    NodeSessionStorage.storage = {};
    return NodeSessionStorage;
}());
exports.NodeSessionStorage = NodeSessionStorage;
//# sourceMappingURL=NodeSessionStorage.js.map