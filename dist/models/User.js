"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt_nodejs_1.default.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt_nodejs_1.default.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    }
    else {
        return next();
    }
});
UserSchema.method('comparePassword', function comparePassword(passw, cb) {
    const user = this;
    bcrypt_nodejs_1.default.compare(passw, user.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
});
exports.default = mongoose_1.default.model('User', UserSchema);
