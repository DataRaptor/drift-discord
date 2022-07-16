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
exports.__esModule = true;
exports.postDiscordUserHandler = void 0;
var models_1 = require("../models");
var logger_1 = require("../services/logger");
var utils_1 = require("../utils");
var apis_1 = require("../apis");
var config_1 = require("../config");
var postDiscordUserHandler = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, accessToken, signature, publicKey_1, decryptedAccessToken, discordUserData, query, user, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, accessToken = _a.accessToken, signature = _a.signature, publicKey_1 = _a.publicKey;
                decryptedAccessToken = (0, utils_1.decryptAccessToken)(accessToken);
                if (!(0, utils_1.verifySignature)(publicKey_1, signature)) return [3, 5];
                discordUserData = (0, apis_1.getDiscordUserData)(decryptedAccessToken);
                return [4, models_1.User.find(__assign({ public_key: publicKey_1 }, discordUserData))];
            case 1:
                query = _b.sent();
                if (!(query.length == 0)) return [3, 3];
                user = new models_1.User(__assign({ public_key: publicKey_1, signature: signature, message: config_1.DRIFT_MESSAGE }, discordUserData));
                return [4, user
                        .save()
                        .then(function () {
                        return logger_1.logger.info("/v1/create_discord_user A user with public key: ".concat(publicKey_1, " was created."));
                    })];
            case 2:
                _b.sent();
                res.status(200).json({
                    ok: true,
                    message: "Welcome! You've successfully linked your discord to Drift."
                });
                return [3, 4];
            case 3:
                logger_1.logger.warn("/v1/create_discord_user warning, A user with ".concat(publicKey_1, " attempted to create a user but is already registed."));
                res.status(200).json({
                    ok: false,
                    message: 'Your discord is already registed with Drift. Welcome back!'
                });
                _b.label = 4;
            case 4: return [3, 6];
            case 5:
                logger_1.logger.error("/v1/create_discord_user warning, A user with ".concat(publicKey_1, " attempted to use an incorrect signature"));
                res.status(500).send({
                    ok: false,
                    message: 'Invalid Signature for Public Key'
                });
                _b.label = 6;
            case 6: return [3, 8];
            case 7:
                error_1 = _b.sent();
                logger_1.logger.error("/v1/create_discord_user failed with error ".concat(error_1.message));
                res.status(500).json({
                    ok: false,
                    message: 'Something went wrong. Please try again.'
                });
                return [3, 8];
            case 8: return [2];
        }
    });
}); };
exports.postDiscordUserHandler = postDiscordUserHandler;
//# sourceMappingURL=postDiscordUser.js.map