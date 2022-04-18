"use strict";
/* IMPORT */
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../color");
/* TO HEX */
function toHex(color) {
    return color_1.default.format.hex.stringify(color_1.default.parse(color));
}
/* EXPORT */
exports.default = toHex;
