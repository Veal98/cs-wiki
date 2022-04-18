"use strict";
/* IMPORT */
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../color");
/* TO HSLA */
function toHsla(color) {
    return color_1.default.format.hsla.stringify(color_1.default.parse(color));
}
/* EXPORT */
exports.default = toHsla;
