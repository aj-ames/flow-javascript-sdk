"use strict";
var BaseHttpClient = (function () {
    function BaseHttpClient() {
    }
    // tslint:disable-next-line:no-reserved-keywords
    BaseHttpClient.prototype.get = function (url, options) {
        return this.request('GET', url, options);
    };
    BaseHttpClient.prototype.options = function (url, options) {
        return this.request('GET', url, options);
    };
    BaseHttpClient.prototype.post = function (url, options) {
        return this.request('POST', url, options);
    };
    BaseHttpClient.prototype.put = function (url, options) {
        return this.request('PUT', url, options);
    };
    BaseHttpClient.prototype.setAuthenticationHeader = function (authHeader) {
        this.authHeader = authHeader;
    };
    BaseHttpClient.prototype.getAuthenticationHeader = function () {
        return this.authHeader;
    };
    BaseHttpClient.prototype.hasAuthenticationInfo = function () {
        return !!this.authHeader;
    };
    return BaseHttpClient;
}());
exports.BaseHttpClient = BaseHttpClient;
//# sourceMappingURL=BaseHttpClient.js.map