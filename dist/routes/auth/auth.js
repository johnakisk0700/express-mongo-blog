"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../database/models/User"));
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const ApiErrors_1 = require("../../core/ApiErrors");
const bcrypt = __importStar(require("bcrypt"));
const ApiResponse_1 = require("../../core/ApiResponse");
const Validator_1 = require("../../core/Validator");
const validationSchema_1 = require("./validationSchema");
const router = (0, express_1.Router)();
router.post("/register", (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const newUser = new User_1.default({
        username: username,
        password: password,
    });
    // save the user
    const savedUser = yield newUser.save();
    if (!savedUser)
        throw new ApiErrors_1.InternalError("Invalid e-mail perhaps?");
    new ApiResponse_1.SuccessResponse("Registered successfuly.", {
        user: savedUser,
    });
})));
router.post("/login", (0, Validator_1.validate)(validationSchema_1.authSchema.login), (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield User_1.default.findOne({ username: username });
    if (!user)
        throw new ApiErrors_1.AuthFailureError("Wrong username.");
    const isMatch = yield bcrypt.compare(password, user.password);
    if (!isMatch)
        throw new ApiErrors_1.AuthFailureError("Wrong password.");
    const accessToken = jsonwebtoken_1.default.sign(user.toJSON(), process.env.ACCESS_SECRET);
    const refreshToken = jsonwebtoken_1.default.sign(user.toJSON(), process.env.REFRESH_SECRET);
    new ApiResponse_1.SuccessResponse("Log in successful.", {
        accessToken,
        refreshToken,
        username: user.username,
    }).send(res);
})));
exports.default = router;
