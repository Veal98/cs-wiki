"use strict";
/* IMPORT */
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../color");
/* TO RGBA */
function toRgba(color) {
    return color_1.default.format.rgba.stringify(color_1.default.parse(color));
}
/* EXPORT */
exports.default = toRgba;
