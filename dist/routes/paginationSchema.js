"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.paginationSchema = joi_1.default.object().keys({
    page: joi_1.default.number().positive().required(),
    perPage: joi_1.default.number().positive().max(20).required(),
});
