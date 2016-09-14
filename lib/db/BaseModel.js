"use strict";
var BaseModel = (function () {
    function BaseModel(data) {
        this._data = data || {};
        this.updateFields(this._data);
    }
    BaseModel.get = function (id) {
        var _this = this;
        return this._api.getObject(this.getType(), id)
            .then(function (obj) {
            return new _this._model(obj);
        });
    };
    BaseModel.all = function (limit) {
        var _this = this;
        var promise = this._api.allObjects(this.getType(), { limit: limit });
        return promise.then(function (objects) {
            return objects.map(function (o) { return new _this._model(o); });
        });
    };
    BaseModel.find = function (query, options) {
        var _this = this;
        return this._api.getObjects(this.getType(), query, options)
            .then(function (queryResult) {
            return queryResult.objects.map(function (o) { return new _this._model(o); });
        });
    };
    BaseModel.count = function (query) {
        return this._api.countObjects(this.getType(), query);
    };
    BaseModel.prototype.save = function () {
        var _this = this;
        var api = this.constructor['_api'];
        var data = {};
        this.constructor['_schema'].fields.forEach(function (field) {
            data[field.name] = _this.convertValue(_this[field.name], field.type);
        });
        if (this['_id']) {
            // update
            return api.updateObject(this.constructor['getType'](), this['_id'], data)
                .then(function () {
                return _this;
            });
        }
        else {
            // create
            return api.createObject(this.constructor['getType'](), data)
                .then(function (newId) {
                _this['_id'] = newId;
                return _this;
            });
        }
    };
    //noinspection ReservedWordAsName
    BaseModel.prototype.delete = function () {
        var api = this.constructor['_api'];
        if (!this['_id'])
            return Promise.reject(new Error('Object must have an id'));
        return api.deleteObject(this.constructor['getType'](), this['_id']);
    };
    // TODO: figure out the best way for web
    // setAttachment() {
    //
    // }
    BaseModel.getName = function () {
        return this._name;
    };
    BaseModel.getType = function () {
        return this._name.toLowerCase();
    };
    BaseModel.getFields = function () {
        return this._schema.fields.map(function (f) { return f.name; });
    };
    BaseModel.prototype.updateFields = function (data) {
        var _this = this;
        if (!data || !this.constructor['_schema'])
            return;
        if (data['_id'])
            this['_id'] = data['_id'];
        this.constructor['_schema'].fields.forEach(function (f) {
            _this[f.name] = _this.convertValue(data[f.name], f.type);
        });
    };
    BaseModel.prototype.convertValue = function (value, type) {
        var _this = this;
        if (value == null || value == undefined)
            return null;
        switch (type) {
            case 'string':
                return "" + value;
            case 'integer':
                return parseInt(value);
            case 'float':
                return parseFloat(value);
            case 'boolean':
                return !!value;
            default:
                if (type.indexOf('array[') == 0)
                    return (Array.isArray(value) ? value : [value]).map(function (v) {
                        return _this.convertValue(v, type.substring(6, type.length - 1));
                    });
                return null;
        }
    };
    return BaseModel;
}());
exports.BaseModel = BaseModel;
function makeModel(cls, api) {
    var newModel = eval("(function " + cls.name + "(data){BaseModel.call(this, data)})");
    // let newModel = function(data){BaseModel.call(this, data)};
    for (var p in BaseModel)
        if (BaseModel.hasOwnProperty(p))
            newModel[p] = BaseModel[p];
    newModel.prototype = Object.create(BaseModel.prototype);
    newModel.prototype.constructor = newModel;
    newModel.prototype.name = cls.name;
    newModel.prototype.constructor._name = cls.name;
    newModel.prototype.constructor._schema = cls;
    newModel.prototype.constructor._api = api;
    newModel.prototype.constructor._model = newModel;
    return newModel;
}
exports.makeModel = makeModel;
//# sourceMappingURL=BaseModel.js.map