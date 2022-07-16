"use strict";
exports.__esModule = true;
exports.User = void 0;
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    discord_id: String,
    username: String,
    avatar: String,
    avatar_decoration: String,
    discriminator: String,
    public_flags: Number,
    flags: Number,
    banner: String,
    banner_color: String,
    accent_color: String,
    locale: String,
    mfa_enabled: Boolean,
    email: String,
    verified: Boolean,
    public_key: String,
    signature: String,
    message: String
});
exports.User = mongoose.model('User', userSchema);
//# sourceMappingURL=index.js.map