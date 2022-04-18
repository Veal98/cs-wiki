"use strict";
/* UNIT */
Object.defineProperty(exports, "__esModule", { value: true });
var Unit = {
    dec2hex: function (dec) {
        var hex = Math.round(dec).toString(16);
        return hex.length > 1 ? hex : "0" + hex;
    }
};
/* EXPORT */
exports.default = Unit;
