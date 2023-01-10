"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const Validator_1 = require("../../core/Validator");
const paginationSchema_1 = require("../paginationSchema");
exports.postSchema = {
    getAll: joi_1.default.object().keys({
        postLang: joi_1.default.valid("en", "el").required(),
        search: joi_1.default.string(),
        pagination: paginationSchema_1.paginationSchema,
    }),
    post: joi_1.default.object().keys({
        category: (0, Validator_1.JoiObjectId)().required(),
        postTitle: joi_1.default.string().min(6).max(120).required(),
        postAuthor: joi_1.default.string().min(6).max(120).required(),
        postDesc: joi_1.default.string().min(20).max(500).required(),
        postLang: joi_1.default.valid("en", "el").required(),
        postContent: joi_1.default.string().min(20).max(5000).required(),
        postImgUrl: joi_1.default.string().required(),
    }),
    postUpdate: joi_1.default.object().keys({
        category: (0, Validator_1.JoiObjectId)(),
        postTitle: joi_1.default.string().min(6).max(120),
        postAuthor: joi_1.default.string().min(6).max(120),
        postDesc: joi_1.default.string().min(20).max(500),
        postLang: joi_1.default.valid("en", "el"),
        postContent: joi_1.default.string().min(20).max(5000),
        postImgUrl: joi_1.default.string(),
    }),
};
