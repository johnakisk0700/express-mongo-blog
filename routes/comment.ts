import { NextFunction, Request, Response } from 'express';
import { CallbackError, Types } from 'mongoose';
import { TODO } from '../types';
import Comment, { IComment } from '../models/Comment';

import express from 'express';
const router = express.Router();

import passport from 'passport';
import passportConfig from '../config/passport';
import asyncHandler from '../helpers/asyncHandler';
import createFreebirthError from '../errors/FreebirthError';
import { applyPagination } from '../helpers';
passportConfig(passport);

// get all comments by postID
router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const postID = req.body.postID;
        if (!postID) return next(createFreebirthError('No postID given ma man.'));

        const pagination = req.body.pagination;
        if (!pagination) return next(createFreebirthError('Pagination is missing ma neguh.'));

        const query = Comment.find({ postID: postID });
        const count = await query.countDocuments();
        applyPagination(query, pagination);

        const comments = await query;
        res.json({ comments: comments, count: count });
    })
);

// get all pending
router.get(
    '/pending',
    passport.authenticate('jwt', { session: false }),
    asyncHandler(async (req, res, next) => {
        const pagination = req.body.pagination;
        if (!pagination) return next(createFreebirthError('Pagination is missing ma neguh.'));

        const query = Comment.find({ state: 'pending' });
        applyPagination(query, pagination);

        const pendingComments = await query;
        res.json(pendingComments);
    })
);

router.post(
    '/submit',
    asyncHandler(async (req, res, next) => {
        const newComment = { ...req.body.comment, status: 'pending' };
        const submitted = await Comment.create(newComment);
        // if (!submitted) throw new
        res.json(submitted);
    })
);

export type CommentUpdate = {
    comments: Types.ObjectId[]; // ids of comments
    targetState: 'pending' | 'approved' | 'cancelled';
};
// update comment state
router.put(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    asyncHandler(async (req, res, next) => {
        const commentUpdate: CommentUpdate = req.body;
        Comment.updateMany({ _id: { $in: commentUpdate.comments } }, { state: commentUpdate.targetState });
    })
);

// delete a comment by ID
router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    asyncHandler(async (req, res, next) => {
        Comment.findByIdAndRemove(req.params.id, req.body, function (err, comment: IComment | null) {
            res.json(comment);
        });
    })
);

export default router;
