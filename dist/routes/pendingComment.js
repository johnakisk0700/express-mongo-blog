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
const CommentThread_1 = __importDefault(require("../models/CommentThread"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("../config/passport"));
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
(0, passport_2.default)(passport_1.default);
// get all comment history
router.get('/', passport_1.default.authenticate('jwt', { session: false }), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    CommentThread_1.default.find(function (err, commentThreads) {
        res.json(commentThreads);
    });
})));
// update comment state
router.put('/update/:id', passport_1.default.authenticate('jwt', { session: false }), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    CommentThread_1.default.findByIdAndUpdate(req.params.id, req.body, {}, function (err, comment) {
        res.json(comment);
    });
})));
// delete a comment by ID
router.delete('/delete/:id', passport_1.default.authenticate('jwt', { session: false }), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    CommentThread_1.default.findByIdAndRemove(req.params.id, req.body, function (err, comment) {
        res.json(comment);
    });
})));
module.exports = router;
