import passport from 'passport';
import passportConfig from '../config/passport';
passportConfig(passport);

import fs from 'fs';
import multer from 'multer';
import Post, { IPost } from '../models/Post';
import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { Archive, BackendArchive, TODO } from '../types';
import { toMonthName, applyPagination } from '../helpers/index';
import express from 'express';
import { PipelineStage } from 'mongoose';
import asyncHandler from '../helpers/asyncHandler';
import createFreebirthError from '../errors/FreebirthError';

const router = express.Router();
//MULTER CONFIG
var storage = multer.diskStorage({
    destination: function (req: Request, file: TODO, cb: TODO) {
        const dir = `uploads/`;

        // if folder doesnt exist on first build, create it.
        if (fs.existsSync(dir)) {
            return cb(null, dir);
        } else {
            fs.mkdir(dir, error => cb(error, dir));
            return cb(null, dir);
        }
    },
    filename: function (req: Request, file: TODO, cb: TODO) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

//POST archive
router.post(
    '/archive',
    asyncHandler(async (req: Request, res: Response) => {
        let match = {};
        if (req.body.postLang) {
            match = { ...match, postLang: req.body.postLang };
        }
        const pipeline: PipelineStage[] = [
            { $match: match },
            {
                $project: {
                    _id: '$_id',
                    created: '$created',
                    name: '$postTitle',
                },
            },
            {
                $group: {
                    _id: { year: { $year: '$created' }, month: { $month: '$created' } },
                    children: { $push: { name: '$name', url: '$_id' } },
                },
            },
            { $sort: { '_id.month': 1 } },
            {
                $set: {
                    name: '$_id.month',
                    count: { $size: '$children' },
                    url: '',
                },
            },
            {
                $group: {
                    _id: '$_id.year',
                    children: { $push: '$$ROOT' },
                },
            },

            {
                $set: {
                    name: '$_id',
                    count: { $sum: '$children.count' },
                    url: '',
                },
            },
            { $sort: { name: -1 } },
        ];

        let archive = await Post.aggregate(pipeline);
        // add names and do final mutations
        const mutatedArchive: Archive[] = archive.map(year => {
            year.children.map((month: any) => (month.name = toMonthName(month.name, req.body.postLang)));
            return year;
        });
        res.json(mutatedArchive);
    })
);

//GET all posts by lang
router.post(
    '/',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { postLang, pagination, search } = req.body;
        let filters = {};
        if (!postLang) return next(createFreebirthError('No lang specified, what you speak freak?'));
        if (postLang) filters = { ...filters, postLang: postLang };
        if (search) filters = { ...filters, $text: { $search: search } };

        let query = Post.find(filters);

        const count = await Post.find(filters).countDocuments();

        if (pagination) query = applyPagination(query, pagination);

        const posts = await query;

        res.json({ posts: posts, count: count });
    })
);

//GET a single post data by ID
router.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        Post.findById(req.params.id, function (err: TODO, post: IPost) {
            if (err) return next(err);
            res.json(post);
        });
    })
);

//POST a post data
router.post(
    '/submit',
    passport.authenticate('jwt', { session: false }),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        Post.create(req.body, function (err: TODO, post: IPost) {
            if (err) return next(err);
            console.log(res);
            res.json(post);
        });
    })
);

//update a post data by ID.
router.put(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        Post.findByIdAndUpdate(req.params.id, req.body, {}, function (err, post: IPost | null) {
            if (err) return next(err);
            res.json(post);
        });
    })
);

//DELETE a post data by ID
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        Post.findByIdAndRemove(req.params.id, req.body, function (err: TODO, post: IPost | null) {
            res.json(post);
        });
    })
);

//Upload IMG
var upload = multer({ storage: storage });
router.post(
    '/imgupload',
    upload.single('image'),
    asyncHandler(async (req: TODO, res: TODO) => {
        res.json(req.file.destination + req.file.filename);
    })
);

export default router;
