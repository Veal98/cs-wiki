"use strict";
/* IMPORT */
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var type_1 = require("./type");
/* CHANNELS */
var Channels = /** @class */ (function () {
    /* CONSTRUCTOR */
    function Channels(data, color) {
        this.color = color;
        this.changed = false;
        this.data = data; //TSC
        this.type = new type_1.default();
    }
    /* API */
    Channels.prototype.set = function (data, color) {
        this.color = color;
        this.changed = false;
        this.data = data; //TSC
        this.type.type = 0 /* ALL */;
        return this;
    };
    /* HELPERS */
    Channels.prototype._ensureHSL = function () {
        var data = this.data;
        var h = data.h, s = data.s, l = data.l;
        if (h === undefined)
            data.h = utils_1.default.channel.rgb2hsl(data, 'h');
        if (s === undefined)
            data.s = utils_1.default.channel.rgb2hsl(data, 's');
        if (l === undefined)
            data.l = utils_1.default.channel.rgb2hsl(data, 'l');
    };
    Channels.prototype._ensureRGB = function () {
        var data = this.data;
        var r = data.r, g = data.g, b = data.b;
        if (r === undefined)
            data.r = utils_1.default.channel.hsl2rgb(data, 'r');
        if (g === undefined)
            data.g = utils_1.default.channel.hsl2rgb(data, 'g');
        if (b === undefined)
            data.b = utils_1.default.channel.hsl2rgb(data, 'b');
    };
    Object.defineProperty(Channels.prototype, "r", {
        /* GETTERS */
        get: function () {
            var data = this.data;
            var r = data.r;
            if (!this.type.is(2 /* HSL */) && r !== undefined)
                return r;
            this._ensureHSL();
            return utils_1.default.channel.hsl2rgb(data, 'r');
        },
        /* SETTERS */
        set: function (r) {
            this.type.set(1 /* RGB */);
            this.changed = true;
            this.data.r = r;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channels.prototype, "g", {
        get: function () {
            var data = this.data;
            var g = data.g;
            if (!this.type.is(2 /* HSL */) && g !== undefined)
                return g;
            this._ensureHSL();
            return utils_1.default.channel.hsl2rgb(data, 'g');
        },
        set: function (g) {
            this.type.set(1 /* RGB */);
            this.changed = true;
            this.data.g = g;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channels.prototype, "b", {
        get: function () {
            var data = this.data;
            var b = data.b;
            if (!this.type.is(2 /* HSL */) && b !== undefined)
                return b;
            this._ensureHSL();
            return utils_1.default.channel.hsl2rgb(data, 'b');
        },
        set: function (b) {
            this.type.set(1 /* RGB */);
            this.changed = true;
            this.data.b = b;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channels.prototype, "h", {
        get: function () {
            var data = this.data;
            var h = data.h;
            if (!this.type.is(1 /* RGB */) && h !== undefined)
                return h;
            this._ensureRGB();
            return utils_1.default.channel.rgb2hsl(data, 'h');
        },
        set: function (h) {
            this.type.set(2 /* HSL */);
            this.changed = true;
            this.data.h = h;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channels.prototype, "s", {
        get: function () {
            var data = this.data;
            var s = data.s;
            if (!this.type.is(1 /* RGB */) && s !== undefined)
                return s;
            this._ensureRGB();
            return utils_1.default.channel.rgb2hsl(data, 's');
        },
        set: function (s) {
            this.type.set(2 /* HSL */);
            this.changed = true;
            this.data.s = s;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channels.prototype, "l", {
        get: function () {
            var data = this.data;
            var l = data.l;
            if (!this.type.is(1 /* RGB */) && l !== undefined)
                return l;
            this._ensureRGB();
            return utils_1.default.channel.rgb2hsl(data, 'l');
        },
        set: function (l) {
            this.type.set(2 /* HSL */);
            this.changed = true;
            this.data.l = l;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channels.prototype, "a", {
        get: function () {
            return this.data.a;
        },
        set: function (a) {
            this.changed = true;
            this.data.a = a;
        },
        enumerable: true,
        configurable: true
    });
    return Channels;
}());
/* EXPORT */
exports.default = Channels;
