import passport from 'passport';
import passportConfig from '../config/passport';
passportConfig(passport);

import express from 'express';
import { ISubscribe } from '../models/Subscribe';
import { TODO } from '../types';
import Subscribe from '../models/Subscribe';
import asyncHandler from '../helpers/asyncHandler';
const router = express.Router();

//GET the list of subscribes
router.get(
    '/',
    asyncHandler(async (req, res, next) => {
        Subscribe.find(function (err: TODO, subscribes: ISubscribe[]) {
            res.json(subscribes);
        });
    })
);

router.get(
    '/all',
    asyncHandler(async (req, res) => {
        const subscribes = await Subscribe.find();
        res.json(subscribes);
    })
);

//POST a subscribe data
router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        Subscribe.findOne({ email: req.body.email }, function (err: TODO, subscribe: ISubscribe) {
            if (subscribe) {
                console.log('found', subscribe);
                res.status(204).send({ success: false, msg: 'Email already exists.' });
            } else {
                Subscribe.create(req.body, function (err: TODO, subscribe: ISubscribe) {
                    res.json(subscribe);
                });
            }
        });
    })
);

export default router;
