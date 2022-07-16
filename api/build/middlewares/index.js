"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.createRateLimitMiddleware = exports.createBodyParserMiddleware = exports.createJsonMiddleware = exports.createCorsMiddleware = void 0;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var createCorsMiddleware = function () { return (0, cors_1["default"])(); };
exports.createCorsMiddleware = createCorsMiddleware;
var createJsonMiddleware = function () { return express_1["default"].json(); };
exports.createJsonMiddleware = createJsonMiddleware;
var createBodyParserMiddleware = function () {
    return body_parser_1["default"].urlencoded({
        extended: true
    });
};
exports.createBodyParserMiddleware = createBodyParserMiddleware;
var createRateLimitMiddleware = function (windowMs, maxRequestPerWindowMs) {
    return (0, express_rate_limit_1["default"])({
        windowMs: windowMs,
        max: maxRequestPerWindowMs,
        standardHeaders: true,
        legacyHeaders: false
    });
};
exports.createRateLimitMiddleware = createRateLimitMiddleware;
//# sourceMappingURL=index.js.map