"use strict";
var BaseModel_1 = require('./BaseModel');
var Api_1 = require('./api/Api');
var DbApiClient = (function () {
    function DbApiClient() {
    }
    DbApiClient.prototype.init = function (httpClient) {
        var _this = this;
        this.api = new Api_1.Api(httpClient);
        return this.api.fetchSchema()
            .then(function (schema) {
            _this.generateModels(schema);
        });
    };
    DbApiClient.prototype.getAvailableModels = function () {
        var _this = this;
        var models = [];
        Object.keys(this).forEach(function (p) {
            if (_this.hasOwnProperty(p) && _this[p].hasOwnProperty('_schema')) {
                models.push(p);
            }
        });
        return models;
    };
    DbApiClient.prototype.generateModels = function (schema) {
        var _this = this;
        schema.classes.forEach(function (cls) {
            _this[cls.name] = BaseModel_1.makeModel(cls, _this.api);
        });
    };
    return DbApiClient;
}());
exports.DbApiClient = DbApiClient;
//# sourceMappingURL=DbApiClient.js.map