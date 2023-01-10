"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth/auth"));
const categories_1 = __importDefault(require("./categories/categories"));
const post_1 = __importDefault(require("./post/post"));
const subscriptions_1 = __importDefault(require("./subscriptions/subscriptions"));
const comments_1 = __importDefault(require("./comments/comments"));
const router = (0, express_1.Router)();
router.use("/api/auth", auth_1.default);
router.use("/api/categories", categories_1.default);
router.use("/api/posts", post_1.default);
router.use("/api/comments", comments_1.default);
router.use("/api/subscriptions", subscriptions_1.default);
exports.default = router;
