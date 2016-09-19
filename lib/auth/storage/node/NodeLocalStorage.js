"use strict";
var fs = require('fs');
var os = require('os');
var path = require('path');
var FILE = path.join(os.tmpdir(), '.flow-sdk-storage');
var NodeLocalStorage = (function () {
    function NodeLocalStorage() {
        NodeLocalStorage.checkFile();
    }
    NodeLocalStorage.prototype.clear = function () {
        throw new Error('Not implemented');
    };
    NodeLocalStorage.prototype.getItem = function (key) {
        var d = NodeLocalStorage.readFile();
        return d[key];
    };
    NodeLocalStorage.prototype.key = function () {
        return undefined;
    };
    NodeLocalStorage.prototype.removeItem = function (key) {
        var d = NodeLocalStorage.readFile();
        delete d[key];
        NodeLocalStorage.writeFile(d);
    };
    NodeLocalStorage.prototype.setItem = function (key, data) {
        var d = NodeLocalStorage.readFile();
        d[key] = data;
        NodeLocalStorage.writeFile(d);
    };
    NodeLocalStorage.checkFile = function () {
        try {
            fs.statSync(FILE);
        }
        catch (err) {
            fs.writeFileSync(FILE, '{}', { mode: '600' });
        }
    };
    NodeLocalStorage.readFile = function () {
        return JSON.parse(fs.readFileSync(FILE, { encoding: 'utf8' }));
    };
    NodeLocalStorage.writeFile = function (data) {
        fs.writeFileSync(FILE, JSON.stringify(data), { mode: 600 });
    };
    return NodeLocalStorage;
}());
exports.NodeLocalStorage = NodeLocalStorage;
//# sourceMappingURL=NodeLocalStorage.js.map