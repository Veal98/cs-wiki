"use strict";
/* IMPORT */
Object.defineProperty(exports, "__esModule", { value: true });
/* TYPE */
var Type = /** @class */ (function () {
    function Type() {
        this.type = 0 /* ALL */;
    }
    Type.prototype.get = function () {
        return this.type;
    };
    Type.prototype.set = function (type) {
        if (this.type && this.type !== type)
            throw new Error('Cannot change both RGB and HSL channels at the same time');
        this.type = type;
    };
    Type.prototype.reset = function () {
        this.type = 0 /* ALL */;
    };
    Type.prototype.is = function (type) {
        return this.type === type;
    };
    return Type;
}());
/* EXPORT */
exports.default = Type;
