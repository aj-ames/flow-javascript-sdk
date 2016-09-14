"use strict";
var Schema_1 = require("../schema/Schema");
var Config_1 = require("../../auth/authenticator/config/Config");
var cerialize_1 = require("cerialize");
var Http_1 = require("../../utils/Http");
var API_BASE_PATH = "/api/v1/storage";
var Api = (function () {
    function Api(httpClient) {
        this.httpClient = httpClient;
    }
    Api.prototype.fetchSchema = function () {
        return this.httpClient.get("" + Config_1.AuthDefaults.BASE_URL + API_BASE_PATH + "/_schema")
            .then(function (response) {
            if (response.status != 200) {
                throw new Error('Cannot fetch database schema');
            }
            return cerialize_1.Deserialize(JSON.parse(response.body), Schema_1.Schema);
        });
    };
    Api.prototype.getObject = function (type, id) {
        return this.httpClient.get("" + Config_1.AuthDefaults.BASE_URL + API_BASE_PATH + "/data/" + type + "/" + id)
            .then(function (response) {
            switch (response.status) {
                case 200:
                    return JSON.parse(response.body);
                case 404:
                    throw new Error('Object not found');
                default:
                    throw new Error("Unexpected API response (" + response.status + ")");
            }
        });
    };
    Api.prototype.getObjects = function (type, query, options) {
        return this.httpClient.get("" + Config_1.AuthDefaults.BASE_URL + API_BASE_PATH + "/data/" + type + "/?" + Api.getObjectsRequestQuerystring(query, options))
            .then(function (response) {
            switch (response.status) {
                case 200:
                    return JSON.parse(response.body);
                default:
                    throw new Error("Unexpected API response (" + response.status + ")");
            }
        });
    };
    Api.prototype.allObjects = function (type, options) {
        var _this = this;
        var requestOptions = { page: 1 };
        var limit = options && options.limit ? options.limit : null;
        if (limit && limit < 1000)
            requestOptions.limit = limit;
        return this.getObjects(type, requestOptions)
            .then(function (queryResult) {
            var pageSize = queryResult.objects.length;
            var objs = queryResult.objects;
            if (queryResult.metadata.pages > 1 && (!limit || pageSize < limit)) {
                var pages = queryResult.metadata.pages - 1;
                if (limit)
                    pages = Math.min((Math.ceil(limit / pageSize) - 1), pages);
                return Promise.all(Array.apply(null, Array(pages)).map(function (_, page) {
                    var pageRequestOptions = { page: requestOptions.page + page + 1 };
                    if (limit)
                        pageRequestOptions.limit = pageSize;
                    if (requestOptions.limit)
                        pageRequestOptions.limit = requestOptions.limit;
                    return _this.getObjects(type, pageRequestOptions);
                }))
                    .then(function (results) {
                    return objs.concat.apply(objs, results.map(function (r) { return r.objects; }));
                });
            }
            else {
                return objs;
            }
        })
            .then(function (objects) {
            if (limit && objects.length > limit) {
                return objects.slice(0, limit);
            }
            return objects;
        });
    };
    Api.prototype.countObjects = function (type, query) {
        return this.getObjects(type, query, { limit: 1 })
            .then(function (queryResult) {
            return queryResult.metadata.total;
        });
    };
    Api.prototype.createObject = function (type, data) {
        var options = {};
        options.body = data;
        return this.httpClient.post("" + Config_1.AuthDefaults.BASE_URL + API_BASE_PATH + "/data/" + type + "/", options)
            .then(function (response) {
            switch (response.status) {
                case 201:
                    var location_1 = response.headers['Location'].split('/');
                    return location_1[location_1.length - 1];
                default:
                    throw new Error("Unexpected API response (" + response.status + ")");
            }
        });
    };
    Api.prototype.updateObject = function (type, id, data) {
        var options = {};
        options.body = data;
        return this.httpClient.post("" + Config_1.AuthDefaults.BASE_URL + API_BASE_PATH + "/data/" + type + "/" + id, options)
            .then(function (response) {
            switch (response.status) {
                case 200:
                    return;
                case 404:
                    throw new Error('Object not found');
                default:
                    throw new Error("Unexpected API response (" + response.status + ")");
            }
        });
    };
    Api.prototype.deleteObject = function (type, id) {
        return this.httpClient.request('DELETE', "" + Config_1.AuthDefaults.BASE_URL + API_BASE_PATH + "/data/" + type + "/" + id)
            .then(function (response) {
            switch (response.status) {
                case 200:
                    return;
                case 404:
                    throw new Error('Object not found');
                default:
                    throw new Error("Unexpected API response (" + response.status + ")");
            }
        });
    };
    Api.getObjectsRequestQuerystring = function (query, options) {
        var requestQuery = options || {};
        if (query)
            requestQuery.query = query;
        return Http_1.urlencode(requestQuery);
    };
    return Api;
}());
exports.Api = Api;
//# sourceMappingURL=Api.js.map