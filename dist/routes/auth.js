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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("../config/passport"));
(0, passport_2.default)(passport_1.default);
const settings_1 = __importDefault(require("../config/settings"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
router.post('/register', (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('try to register!!!');
    if (!req.body.username || !req.body.password) {
        res.json({ success: false, msg: 'Please pass username and password.' });
    }
    else {
        var newUser = new User_1.default({
            username: req.body.username,
            password: req.body.password,
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({ success: false, msg: 'Username already exists.' });
            }
            res.json({ success: true, msg: 'Successful created new user.' });
        });
    }
})));
router.post('/login', (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findOne({
        username: req.body.username,
    }, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            res.status(401).send({
                success: false,
                msg: 'Authentication failed. User not found.',
            });
        }
        else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jsonwebtoken_1.default.sign(user.toJSON(), settings_1.default.secret);
                    // return the information including token as JSON
                    res.json({ success: true, token: 'JWT ' + token });
                }
                else {
                    res.status(401).send({
                        success: false,
                        msg: 'Authentication failed. Wrong password.',
                    });
                }
            });
        }
    });
})));
router.post('/logout', passport_1.default.authenticate('jwt', { session: false }), (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.logout({ keepSessionInfo: false }, (err) => console.log(err));
    res.json({ success: true });
})));
exports.default = router;
