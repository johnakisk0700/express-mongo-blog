"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//This config is used for getting the user by matching JWT token with token get from the client.
var JwtStrategy = require('passport-jwt').Strategy, ExtractJwt = require('passport-jwt').ExtractJwt;
// load up the user model
const User_1 = __importDefault(require("../models/User"));
const settings_1 = __importDefault(require("./settings"));
function passport(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = settings_1.default.secret;
    passport.use(new JwtStrategy(opts, function (token, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                User_1.default.findOne({ id: token.id }, function (err, user) {
                    done(null, user);
                });
            }
            catch (err) {
                return done(err, false);
            }
        });
    }));
}
exports.default = passport;
