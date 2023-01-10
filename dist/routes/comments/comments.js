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
const Comment_1 = __importDefault(require("../../database/models/Comment"));
const passport_1 = __importDefault(require("../../core/passport"));
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const helpers_1 = require("../../helpers");
const express_1 = __importDefault(require("express"));
const ApiErrors_1 = require("../../core/ApiErrors");
const Validator_1 = require("../../core/Validator");
const ApiResponse_1 = require("../../core/ApiResponse");
const validationSchema_1 = require("./validationSchema");
const router = express_1.default.Router();
// [GET] By ID
router.get("/:id", (0, Validator_1.validateIdParam)(), (0, Validator_1.validate)(validationSchema_1.commentsSchema.paginated), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postID = req.params.id;
    if (!postID)
        throw new ApiErrors_1.BadRequestError("No postID given ma man.");
    const pagination = req.body.pagination;
    if (!pagination)
        throw new ApiErrors_1.BadRequestError("Pagination is missing ma neguh.");
    const query = Comment_1.default.find({ postID: postID, state: "approved" });
    const count = yield query.countDocuments();
    (0, helpers_1.applyPagination)(query, pagination);
    const comments = yield query;
    new ApiResponse_1.SuccessResponse("Success", { comments: comments, count: count }).send(res);
})));
// [GET] All Pending
router.get("/pending", passport_1.default.authenticate("jwt", { session: false }), (0, Validator_1.validate)(validationSchema_1.commentsSchema.paginated), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pagination = req.body.pagination;
    const query = Comment_1.default.find({ state: "pending" });
    (0, helpers_1.applyPagination)(query, pagination);
    const pendingComments = yield query;
    new ApiResponse_1.SuccessResponse("Pending Comments", pendingComments).send(res);
})));
// [POST] Create comment
// It's public, that means status defaults to 'pending' automatically.
router.post("/submit", (0, Validator_1.validate)(validationSchema_1.commentsSchema.createComment), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newComment = req.body.comment;
    const submitted = yield Comment_1.default.create(newComment);
    if (!submitted)
        throw new ApiErrors_1.InternalError("[DB] weird error?");
    new ApiResponse_1.SuccessResponse("Comment successfuly submitted.", submitted).send(res);
})));
// [PATCH] Change comment state
router.patch("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, Validator_1.validate)(validationSchema_1.commentsSchema.updateStates), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { comments, targetState } = req.body;
    const updatedComms = yield Comment_1.default.updateMany({ _id: { $in: comments } }, { state: targetState });
    // [not sure]
    if (!updatedComms)
        throw new ApiErrors_1.InternalError("[DB] Error at updating.");
    new ApiResponse_1.SuccessResponse("Comments successfuly updated!", updatedComms).send(res);
})));
// [DELETE] a comment by ID
router.delete("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, Validator_1.validateIdParam)(), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedCom = yield Comment_1.default.findByIdAndRemove(req.params.id);
    if (!deletedCom)
        throw new ApiErrors_1.BadRequestError("Comment not found.");
    new ApiResponse_1.SuccessResponse("Comment deleted successfuly", deletedCom).send(res);
})));
exports.default = router;
