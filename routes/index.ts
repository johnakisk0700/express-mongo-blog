import express from 'express';
import { TODO } from '../types';
const router = express.Router();

import Category from '../models/Category';
import Post, { IPost } from '../models/Post';

router.get('/category', function (req, res, next) {
    Category.find(function (err, categories) {
        if (err) return next(err);
        res.json(categories);
    });
});

router.get('/bycategory/:id', function (req, res, next) {
    Post.find({ category: req.params.id }, function (err: TODO, posts: IPost[]) {
        if (err) return next(err);
        res.json(posts);
    });
});

router.get('/post', function (req, res, next) {
    Post.find(function (err, posts: IPost[]) {
        if (err) return next(err);
        res.json(posts);
    });
});

router.get('/post/:id', function (req, res, next) {
    Post.findById(req.params.id, function (err: TODO, post: IPost) {
        if (err) return next(err);
        res.json(post);
    });
});

export default router;
