"use strict";
/* IMPORT */
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var luminance_1 = require("./luminance");
/* CONTRAST */
function contrast(color1, color2) {
    var luminance1 = luminance_1.default(color1), luminance2 = luminance_1.default(color2), max = Math.max(luminance1, luminance2), min = Math.min(luminance1, luminance2), ratio = (max + Number.EPSILON) / (min + Number.EPSILON);
    return utils_1.default.lang.round(utils_1.default.lang.clamp(ratio, 1, 10));
}
/* EXPORT */
exports.default = contrast;
