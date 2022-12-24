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
const Comment_1 = __importDefault(require("../models/Comment"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("../config/passport"));
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const FreebirthError_1 = __importDefault(require("../errors/FreebirthError"));
const helpers_1 = require("../helpers");
(0, passport_2.default)(passport_1.default);
// get all comments by postID
router.post('/', (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postID = req.body.postID;
    if (!postID)
        return next((0, FreebirthError_1.default)('No postID given ma man.'));
    const pagination = req.body.pagination;
    if (!pagination)
        return next((0, FreebirthError_1.default)('Pagination is missing ma neguh.'));
    const query = Comment_1.default.find({ postID: postID });
    const count = yield query.countDocuments();
    (0, helpers_1.applyPagination)(query, pagination);
    const comments = yield query;
    res.json({ comments: comments, count: count });
})));
// get all pending
router.get('/pending', passport_1.default.authenticate('jwt', { session: false }), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pagination = req.body.pagination;
    if (!pagination)
        return next((0, FreebirthError_1.default)('Pagination is missing ma neguh.'));
    const query = Comment_1.default.find({ state: 'pending' });
    (0, helpers_1.applyPagination)(query, pagination);
    const pendingComments = yield query;
    res.json(pendingComments);
})));
router.post('/submit', (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newComment = Object.assign(Object.assign({}, req.body.comment), { status: 'pending' });
    const submitted = yield Comment_1.default.create(newComment);
    // if (!submitted) throw new
    res.json(submitted);
})));
// update comment state
router.put('/update/:id', passport_1.default.authenticate('jwt', { session: false }), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const commentUpdate = req.body;
    Comment_1.default.updateMany({ _id: { $in: commentUpdate.comments } }, { state: commentUpdate.targetState });
})));
// delete a comment by ID
router.delete('/delete/:id', passport_1.default.authenticate('jwt', { session: false }), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    Comment_1.default.findByIdAndRemove(req.params.id, req.body, function (err, comment) {
        res.json(comment);
    });
})));
exports.default = router;
