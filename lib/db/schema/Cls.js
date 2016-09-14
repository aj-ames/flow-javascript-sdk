"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Field_1 = require("./Field");
var Index_1 = require("./Index");
var Config_1 = require("./Config");
var cerialize_1 = require("cerialize");
var Cls = (function () {
    function Cls() {
    }
    __decorate([
        cerialize_1.deserialize
    ], Cls.prototype, "name", void 0);
    __decorate([
        cerialize_1.deserializeAs(Field_1.Field)
    ], Cls.prototype, "fields", void 0);
    __decorate([
        cerialize_1.deserializeAs(Index_1.Index)
    ], Cls.prototype, "indices", void 0);
    __decorate([
        cerialize_1.deserializeAs(Config_1.Config)
    ], Cls.prototype, "config", void 0);
    return Cls;
}());
exports.Cls = Cls;
//# sourceMappingURL=Cls.js.map