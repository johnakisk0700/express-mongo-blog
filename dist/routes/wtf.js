"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const Category_1 = __importDefault(require("../database/models/Category"));
const Post_1 = __importDefault(require("../database/models/Post"));
router.get("/category", function (req, res, next) {
    Category_1.default.find(function (err, categories) {
        if (err)
            return next(err);
        res.json(categories);
    });
});
router.get("/bycategory/:id", function (req, res, next) {
    Post_1.default.find({ category: req.params.id }, function (err, posts) {
        if (err)
            return next(err);
        res.json(posts);
    });
});
router.get("/post", function (req, res, next) {
    Post_1.default.find(function (err, posts) {
        if (err)
            return next(err);
        res.json(posts);
    });
});
router.get("/post/:id", function (req, res, next) {
    Post_1.default.findById(req.params.id, function (err, post) {
        if (err)
            return next(err);
        res.json(post);
    });
});
exports.default = router;
