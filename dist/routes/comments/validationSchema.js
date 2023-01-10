"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const Validator_1 = require("../../core/Validator");
const paginationSchema_1 = require("../paginationSchema");
exports.commentsSchema = {
    paginated: joi_1.default.object().keys({
        pagination: paginationSchema_1.paginationSchema,
    }),
    createComment: joi_1.default.object().keys({
        postID: (0, Validator_1.JoiObjectId)().required(),
        commentAuthor: joi_1.default.string().min(3).max(50).required(),
        commentContent: joi_1.default.string().min(3).max(1000).required(),
    }),
    updateStates: joi_1.default.object().keys({
        comments: joi_1.default.array(),
        targetState: joi_1.default.string().valid("pending", "approved", "cancelled"),
    }),
};
