"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SubscribeSchema = new mongoose_1.default.Schema({
    id: String,
    country: String,
    email: { type: String, required: true },
    createdAt: { type: Date },
    updated: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model('Subscribe', SubscribeSchema);
