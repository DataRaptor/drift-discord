"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.decryptAccessToken = exports.encryptAccessToken = exports.verifySignature = void 0;
var tweetnacl_1 = require("tweetnacl");
var bs58_1 = __importDefault(require("bs58"));
var aes_encryption_1 = __importDefault(require("aes-encryption"));
var config_1 = require("../config");
var logger_1 = require("../services/logger");
var message = new TextEncoder().encode(config_1.DRIFT_MESSAGE);
var verifySignature = function (publicKey, signature) {
    try {
        return tweetnacl_1.sign.detached.verify(message, bs58_1["default"].decode(signature), bs58_1["default"].decode(publicKey));
    }
    catch (error) {
        logger_1.logger.error("Signature verification failed with error: ".concat(error));
    }
    return false;
};
exports.verifySignature = verifySignature;
var aes = new aes_encryption_1["default"]();
aes.setSecretKey(config_1.AES_HTTP_TRANSPORT_SECRET);
var encryptAccessToken = function (accessToken) { return aes.encrypt(accessToken); };
exports.encryptAccessToken = encryptAccessToken;
var decryptAccessToken = function (encryptedAccessToken) { return aes.decrypt(encryptedAccessToken); };
exports.decryptAccessToken = decryptAccessToken;
//# sourceMappingURL=crypto.js.map