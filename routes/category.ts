import { NextFunction, Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import { TODO } from '../types';
import Category, { ICategory } from '../models/Category';

import express from 'express';
const router = express.Router();

import passport from 'passport';
import passportConfig from '../config/passport';
import asyncHandler from '../helpers/asyncHandler';
passportConfig(passport);

// get the list of the category
router.get(
    '/',
    asyncHandler(async (req, res, next) => {
        Category.find(function (err: TODO, categories: ICategory[]) {
            res.json(categories);
        });
    })
);

// get a single category by ID
router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    asyncHandler(async (req, res, next) => {
        Category.findById(req.params.id, function (err: TODO, category: ICategory) {
            res.json(category);
        });
    })
);

// post a category
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    asyncHandler(async (req, res, next) => {
        Category.create(req.body, function (err: TODO, category: ICategory) {
            if (err) return next(err);
            res.json(category);
        });
    })
);

// update category
router.put(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    asyncHandler(async (req, res, next) => {
        Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            {},
            function (err: CallbackError, category: ICategory | null) {
                res.json(category);
            }
        );
    })
);

// delete a category by ID
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    asyncHandler(async (req, res, next) => {
        Category.findByIdAndRemove(req.params.id, req.body, function (err, category: ICategory | null) {
            res.json(category);
        });
    })
);

export default router;
