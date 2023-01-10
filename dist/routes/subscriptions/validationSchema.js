"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionsSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const paginationSchema_1 = require("../paginationSchema");
exports.subscriptionsSchema = {
    getAll: joi_1.default.object().keys({
        pagination: paginationSchema_1.paginationSchema,
    }),
    subscribe: joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
    }),
};
