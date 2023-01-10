"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.categoriesSchema = {
    category: joi_1.default.object().keys({
        name: joi_1.default.string().min(3).max(50).required(),
        greekName: joi_1.default.string().min(3).max(50).required(),
    }),
    categoryUpdate: joi_1.default.object().keys({
        name: joi_1.default.string().min(3).max(50),
        greekName: joi_1.default.string().min(3).max(50),
    }),
};
