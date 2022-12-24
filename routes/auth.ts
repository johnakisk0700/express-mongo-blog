import express from 'express';
const router = express.Router();

import passport from 'passport';
import passportConfig from '../config/passport';
passportConfig(passport);

import config from '../config/settings';

import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { TODO } from '../types';
import asyncHandler from '../helpers/asyncHandler';

router.post(
    '/register',
    asyncHandler(async (req, res) => {
        console.log('try to register!!!');
        if (!req.body.username || !req.body.password) {
            res.json({ success: false, msg: 'Please pass username and password.' });
        } else {
            var newUser = new User({
                username: req.body.username,
                password: req.body.password,
            });
            // save the user
            newUser.save(function (err) {
                if (err) {
                    return res.json({ success: false, msg: 'Username already exists.' });
                }
                res.json({ success: true, msg: 'Successful created new user.' });
            });
        }
    })
);

router.post(
    '/login',
    asyncHandler(async (req, res) => {
        User.findOne(
            {
                username: req.body.username,
            },
            function (err: TODO, user: IUser) {
                if (err) throw err;

                if (!user) {
                    res.status(401).send({
                        success: false,
                        msg: 'Authentication failed. User not found.',
                    });
                } else {
                    // check if password matches
                    user.comparePassword(req.body.password, function (err: TODO, isMatch: boolean) {
                        if (isMatch && !err) {
                            // if user is found and password is right create a token
                            var token = jwt.sign(user.toJSON(), config.secret);
                            // return the information including token as JSON
                            res.json({ success: true, token: 'JWT ' + token });
                        } else {
                            res.status(401).send({
                                success: false,
                                msg: 'Authentication failed. Wrong password.',
                            });
                        }
                    });
                }
            }
        );
    })
);

router.post(
    '/logout',
    passport.authenticate('jwt', { session: false }),
    asyncHandler(async (req, res) => {
        req.logout({ keepSessionInfo: false }, (err: any) => console.log(err));
        res.json({ success: true });
    })
);

export default router;
