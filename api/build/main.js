"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
require("dotenv").config();
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var bodyParser = require("body-parser");
var tweetnacl_1 = require("tweetnacl");
var cors = require('cors');
var bs58_1 = __importDefault(require("bs58"));
var url_1 = __importDefault(require("url"));
var mongoose = require('mongoose');
var models_1 = require("./models");
var logger_1 = require("./services/logger");
var DISCORD_API = "https://discord.com/api/v8";
var PORT = process.env.PORT || 8080;
var DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
var DISCORD_SECRET = process.env.DISCORD_SECRET || "";
var DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || "";
var DRIFT_MESSAGE = process.env.DRIFT_MESSAGE || "Default Drift Message";
var MONGO_CONN_STRING = process.env.MONGO_CONN_STRING || "";
var CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var app;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, mongoose.connect(MONGO_CONN_STRING)];
            case 1:
                _a.sent();
                app = (0, express_1["default"])();
                app.use(bodyParser.urlencoded({
                    extended: true
                }));
                app.use(express_1["default"].json());
                app.use(cors());
                app.get('/v1/discord_redirect', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var code, urlSearchParams, tokenResponse, access_token, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                code = req.query.code;
                                urlSearchParams = new url_1["default"].URLSearchParams({
                                    client_id: DISCORD_CLIENT_ID,
                                    client_secret: DISCORD_SECRET,
                                    grant_type: 'authorization_code',
                                    code: code.toString(),
                                    redirect_uri: DISCORD_REDIRECT_URI
                                }).toString();
                                return [4, axios_1["default"].post("".concat(DISCORD_API, "/oauth2/token"), urlSearchParams, {
                                        headers: {
                                            "Content-Type": "application/x-www-form-urlencoded"
                                        }
                                    })];
                            case 1:
                                tokenResponse = _a.sent();
                                access_token = tokenResponse.data.access_token;
                                logger_1.logger.info("/v1/discord_redirect executed successfully.");
                                res.redirect("".concat(CLIENT_URL, "?access_token=").concat(access_token));
                                return [3, 3];
                            case 2:
                                error_1 = _a.sent();
                                logger_1.logger.error("/v1/discord_redirect failed with error: ".concat(error_1));
                                res.redirect(CLIENT_URL);
                                return [3, 3];
                            case 3: return [2];
                        }
                    });
                }); });
                app.post('/v1/create_discord_user', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, accessToken, signature, publicKey_1, message, userResponse, discordUserData, query, user, error_2;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 8, , 9]);
                                _a = req.body, accessToken = _a.accessToken, signature = _a.signature, publicKey_1 = _a.publicKey;
                                message = new TextEncoder().encode(DRIFT_MESSAGE);
                                if (!tweetnacl_1.sign.detached.verify(message, bs58_1["default"].decode(signature), bs58_1["default"].decode(publicKey_1))) return [3, 6];
                                return [4, axios_1["default"].get("".concat(DISCORD_API, "/users/@me"), {
                                        headers: {
                                            'Authorization': "Bearer ".concat(accessToken)
                                        }
                                    })];
                            case 1:
                                userResponse = _b.sent();
                                discordUserData = userResponse.data;
                                return [4, models_1.User.find(__assign({ public_key: publicKey_1 }, discordUserData))];
                            case 2:
                                query = _b.sent();
                                if (!(query.length == 0)) return [3, 4];
                                user = new models_1.User(__assign({ public_key: publicKey_1, signature: signature, message: message }, discordUserData));
                                return [4, user.save().then(function () { return logger_1.logger.info("/v1/create_discord_user A user with public key: ".concat(publicKey_1, " was created.")); })];
                            case 3:
                                _b.sent();
                                res.status(200).json({
                                    "ok": true,
                                    "message": "Welcome! You've successfully linked your discord to Drift."
                                });
                                return [3, 5];
                            case 4:
                                logger_1.logger.warn("/v1/create_discord_user warning, A user with ".concat(publicKey_1, " attempted to create a user but is already registed."));
                                res.status(200).json({
                                    "ok": false,
                                    "message": "Your discord is already registed with Drift. Welcome back!"
                                });
                                _b.label = 5;
                            case 5: return [3, 7];
                            case 6:
                                logger_1.logger.error("/v1/create_discord_user warning, A user with ".concat(publicKey_1, " attempted to use an incorrect signature"));
                                res.status(500).send({
                                    "ok": false,
                                    "message": "Invalid Signature for Public Key"
                                });
                                _b.label = 7;
                            case 7: return [3, 9];
                            case 8:
                                error_2 = _b.sent();
                                logger_1.logger.error("/v1/create_discord_user failed with error ".concat(error_2.message));
                                res.status(500).json({
                                    "ok": false,
                                    "message": "Something went wrong. Please try again."
                                });
                                return [3, 9];
                            case 9: return [2];
                        }
                    });
                }); });
                app.get('/v1/get_discord_user', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var signature, publicKey, message, query, user, error_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 4, , 5]);
                                signature = req.query.signature;
                                publicKey = req.query.publicKey;
                                message = new TextEncoder().encode(DRIFT_MESSAGE);
                                if (!tweetnacl_1.sign.detached.verify(message, bs58_1["default"].decode(signature), bs58_1["default"].decode(publicKey))) return [3, 2];
                                return [4, models_1.User.find({
                                        public_key: publicKey
                                    })];
                            case 1:
                                query = _a.sent();
                                user = query[query.length - 1];
                                logger_1.logger.info("/v1/get_discord_user successfully returned a user with public key: ".concat(publicKey));
                                res.status(200).json({
                                    "ok": true,
                                    "message": "Welcome back!",
                                    "user": user
                                });
                                return [3, 3];
                            case 2:
                                logger_1.logger.info("/v1/get_discord_user successfully returned a user with public key: ".concat(publicKey));
                                res.status(200).json({
                                    "ok": true,
                                    "message": "Connect your discord to get all of the benefits of Drift discord."
                                });
                                _a.label = 3;
                            case 3: return [3, 5];
                            case 4:
                                error_3 = _a.sent();
                                logger_1.logger.error("/v1/create_discord_user failed with error ".concat(error_3.message));
                                res.status(500).json({
                                    "ok": false,
                                    "message": "Could not get user data"
                                });
                                return [3, 5];
                            case 5: return [2];
                        }
                    });
                }); });
                app.listen(PORT, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2, console.log("API started...")];
                }); }); });
                return [2];
        }
    });
}); };
main();
//# sourceMappingURL=main.js.map