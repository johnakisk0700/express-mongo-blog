import { Types } from "mongoose";
import Comment, { IComment } from "../../database/models/Comment";
import passport from "../../core/passport";
import asyncHandler from "../../helpers/asyncHandler";
import { applyPagination } from "../../helpers";

import express from "express";
import { BadRequestError, InternalError } from "../../core/ApiErrors";
import { validate, validateIdParam } from "../../core/Validator";
import { SuccessResponse } from "../../core/ApiResponses";
import { commentsSchema } from "./validationSchema";
const router = express.Router();

// [GET] By ID
router.get(
  "/:id",
  validateIdParam(),
  validate(commentsSchema.paginated),
  asyncHandler(async (req, res, next) => {
    const postID = req.params.id;
    if (!postID) throw new BadRequestError("No postID given ma man.");

    const pagination = req.body.pagination;
    if (!pagination)
      throw new BadRequestError("Pagination is missing ma neguh.");

    const query = Comment.find({ postID: postID, state: "approved" });
    const count = await query.countDocuments();
    applyPagination(query, pagination);

    const comments = await query;
    new SuccessResponse("Success", { comments: comments, count: count }).send(
      res
    );
  })
);

// [GET] All Pending
router.get(
  "/pending",
  passport.authenticate("jwt", { session: false }),
  validate(commentsSchema.paginated),
  asyncHandler(async (req, res, next) => {
    const pagination = req.body.pagination;

    const query = Comment.find({ state: "pending" });
    applyPagination(query, pagination);
    const pendingComments = await query;

    new SuccessResponse("Pending Comments", pendingComments).send(res);
  })
);

// [POST] Create comment
// It's public, that means status defaults to 'pending' automatically.
router.post(
  "/submit",
  validate(commentsSchema.createComment),
  asyncHandler(async (req, res, next) => {
    const newComment = req.body.comment;
    const submitted = await Comment.create(newComment);
    if (!submitted) throw new InternalError("[DB] weird error?");

    new SuccessResponse("Comment successfuly submitted.", submitted).send(res);
  })
);

export type CommentUpdate = {
  comments: Types.ObjectId[]; // ids of comments
  targetState: "pending" | "approved" | "cancelled";
};
// [PATCH] Change comment state
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(commentsSchema.updateStates),
  asyncHandler(async (req, res, next) => {
    const { comments, targetState }: CommentUpdate = req.body;
    const updatedComms = await Comment.updateMany(
      { _id: { $in: comments } },
      { state: targetState }
    );

    // [not sure]
    if (!updatedComms) throw new InternalError("[DB] Error at updating.");

    new SuccessResponse("Comments successfuly updated!", updatedComms).send(
      res
    );
  })
);

// [DELETE] a comment by ID
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateIdParam(),
  asyncHandler(async (req, res, next) => {
    const deletedCom = await Comment.findByIdAndRemove(req.params.id);
    if (!deletedCom) throw new BadRequestError("Comment not found.");

    new SuccessResponse("Comment deleted successfuly", deletedCom).send(res);
  })
);

export default router;
