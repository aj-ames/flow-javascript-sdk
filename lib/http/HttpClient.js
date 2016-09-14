"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var axios = require("axios");
var Config_1 = require("../auth/authenticator/config/Config");
var BaseHttpClient_1 = require("./BaseHttpClient");
var HttpClient = (function (_super) {
    __extends(HttpClient, _super);
    function HttpClient() {
        _super.apply(this, arguments);
    }
    HttpClient.prototype.request = function (method, url, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            options = options ? options : {};
            var requestOptions = {
                method: method,
                url: url,
                responseType: 'text',
                transformResponse: function (d) { return typeof d == 'string' ? d : "" + d; }
            };
            if (_this.hasAuthenticationInfo()) {
                options.headers = options.headers || {};
                options.headers[Config_1.AuthDefaults.AUTHENTICATION_HEADER] = _this.getAuthenticationHeader();
            }
            if (options.body)
                requestOptions.data = typeof options.body == 'string' ? options.body : JSON.stringify(options.body);
            if (options.query)
                requestOptions.params = options.query;
            if (options.headers)
                requestOptions.headers = options.headers;
            if (options.files)
                throw new Error('Not implemented');
            if (options.formData)
                throw new Error('Not implemented');
            if (options.timeout)
                requestOptions.timeout = options.timeout;
            if (options.connectionTimeout)
                throw new Error('Not implemented');
            axios(requestOptions)
                .then(function (response) {
                var finalResponse = {
                    status: response.status,
                    body: response.data,
                    headers: response.headers
                };
                if (response.status < 300) {
                    resolve(finalResponse);
                }
                else {
                    reject(finalResponse);
                }
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    return HttpClient;
}(BaseHttpClient_1.BaseHttpClient));
exports.HttpClient = HttpClient;
//# sourceMappingURL=HttpClient.js.map