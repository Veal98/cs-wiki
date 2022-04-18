"use strict";
/* LANG */
Object.defineProperty(exports, "__esModule", { value: true });
var Lang = {
    clamp: function (number, lower, upper) {
        if (lower > upper)
            return Math.min(lower, Math.max(upper, number));
        return Math.min(upper, Math.max(lower, number));
    },
    round: function (number) {
        return Math.round(number * 10000000000) / 10000000000;
    }
};
/* EXPORT */
exports.default = Lang;
