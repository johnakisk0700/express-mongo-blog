//This config is used for getting the user by matching JWT token with token get from the client.
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

import { JwtPayload } from 'jsonwebtoken';
import { PassportStatic } from 'passport';
import { TODO } from '../types';
// load up the user model
import User, { IUser } from '../models/User';
import settings from './settings';

function passport(passport: PassportStatic) {
    var opts: any = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = settings.secret;
    passport.use(
        new JwtStrategy(opts, async function (token: JwtPayload, done: TODO) {
            try {
                User.findOne({ id: token.id }, function (err: TODO, user: IUser) {
                    done(null, user);
                });
            } catch (err) {
                return done(err, false);
            }
        })
    );
}

export default passport;
