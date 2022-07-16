"use strict";
exports.__esModule = true;
exports.AES_HTTP_TRANSPORT_SECRET = exports.CLIENT_URL = exports.DRIFT_MESSAGE = exports.DISCORD_REDIRECT_URI = exports.DISCORD_SECRET = exports.DISCORD_CLIENT_ID = exports.DISCORD_API = exports.MONGO_CONN_STRING = exports.PORT = void 0;
require('dotenv').config();
exports.PORT = process.env.PORT || 8080;
exports.MONGO_CONN_STRING = process.env.MONGO_CONN_STRING || '';
exports.DISCORD_API = 'https://discord.com/api/v8';
exports.DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
exports.DISCORD_SECRET = process.env.DISCORD_SECRET || '';
exports.DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || '';
exports.DRIFT_MESSAGE = process.env.DRIFT_MESSAGE ||
    "Welcome to Drift Discord! Drift\u2019s goal is to bring a state-of-the-art trader-centric experience from centralized exchanges on-chain. We're a team of experienced traders and builders from DeFi and traditional finance working together to make this a reality.";
exports.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
exports.AES_HTTP_TRANSPORT_SECRET = process.env.AES_HTTP_TRANSPORT_SECRET || "11122233344455566677788822244455555555555555555231231321313aaaff";
//# sourceMappingURL=index.js.map