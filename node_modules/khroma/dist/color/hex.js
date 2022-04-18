"use strict";
/* IMPORT */
Object.defineProperty(exports, "__esModule", { value: true });
var reusable_1 = require("../channels/reusable");
var consts_1 = require("../consts");
/* HEX */
var Hex = {
    /* VARIABLES */
    re: /^#((?:[a-f0-9]{2}){2,4}|[a-f0-9]{3})$/i,
    /* API */
    parse: function (color) {
        if (color.charCodeAt(0) !== 35)
            return; // '#'
        var match = color.match(Hex.re);
        if (!match)
            return;
        var hex = match[1], dec = parseInt(hex, 16), length = hex.length, hasAlpha = length % 4 === 0, isFullLength = length > 4, multiplier = isFullLength ? 1 : 17, bits = isFullLength ? 8 : 4, bitsOffset = hasAlpha ? 0 : -1, mask = isFullLength ? 255 : 15;
        return reusable_1.default.set({
            r: ((dec >> (bits * (bitsOffset + 3))) & mask) * multiplier,
            g: ((dec >> (bits * (bitsOffset + 2))) & mask) * multiplier,
            b: ((dec >> (bits * (bitsOffset + 1))) & mask) * multiplier,
            a: hasAlpha ? (dec & mask) * multiplier / 255 : 1
        }, color);
    },
    stringify: function (channels) {
        var r = channels.r, g = channels.g, b = channels.b, a = channels.a;
        if (a < 1) { // #RRGGBBAA
            return "#" + consts_1.DEC2HEX[Math.round(r)] + consts_1.DEC2HEX[Math.round(g)] + consts_1.DEC2HEX[Math.round(b)] + consts_1.DEC2HEX[Math.round(a * 255)];
        }
        else { // #RRGGBB
            return "#" + consts_1.DEC2HEX[Math.round(r)] + consts_1.DEC2HEX[Math.round(g)] + consts_1.DEC2HEX[Math.round(b)];
        }
    }
};
/* EXPORT */
exports.default = Hex;
