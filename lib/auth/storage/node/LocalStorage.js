"use strict";
var fs = require('fs');
var os = require('os');
var path = require('path');
var FILE = path.join(os.tmpdir(), '.flow-sdk-storage');
var LocalStorage = (function () {
    function LocalStorage() {
        this.checkFile();
    }
    LocalStorage.prototype.clear = function () {
        throw new Error('Not implemented');
    };
    LocalStorage.prototype.getItem = function (key) {
        var d = this.readFile();
        return d[key];
    };
    LocalStorage.prototype.key = function (index) {
        return undefined;
    };
    LocalStorage.prototype.removeItem = function (key) {
        var d = this.readFile();
        delete d[key];
        this.writeFile(d);
    };
    LocalStorage.prototype.setItem = function (key, data) {
        var d = this.readFile();
        d[key] = data;
        this.writeFile(d);
    };
    LocalStorage.prototype.checkFile = function () {
        try {
            fs.statSync(FILE);
        }
        catch (err) {
            fs.writeFileSync(FILE, '{}', { mode: '600' });
        }
    };
    LocalStorage.prototype.readFile = function () {
        return JSON.parse(fs.readFileSync(FILE, { encoding: 'utf8' }));
    };
    LocalStorage.prototype.writeFile = function (data) {
        fs.writeFileSync(FILE, JSON.stringify(data), { mode: 600 });
    };
    return LocalStorage;
}());
exports.LocalStorage = LocalStorage;
//# sourceMappingURL=LocalStorage.js.map