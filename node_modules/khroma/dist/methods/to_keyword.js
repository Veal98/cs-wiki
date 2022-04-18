"use strict";
/* IMPORT */
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../color");
/* TO KEYWORD */
function toKeyword(color) {
    return color_1.default.format.keyword.stringify(color_1.default.parse(color));
}
/* EXPORT */
exports.default = toKeyword;
