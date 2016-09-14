"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Cls_1 = require("./Cls");
var cerialize_1 = require("cerialize");
var Schema = (function () {
    function Schema() {
    }
    __decorate([
        cerialize_1.deserializeAs(Cls_1.Cls)
    ], Schema.prototype, "classes", void 0);
    return Schema;
}());
exports.Schema = Schema;
//# sourceMappingURL=Schema.js.map