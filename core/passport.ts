import passport from "passport";
import passportJwt from "passport-jwt";
import crypto from "crypto";
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

import { JwtPayload } from "jsonwebtoken";
import { TODO } from "../types";
// load up the user model
import User, { IUser } from "../database/models/User";
import { AuthFailureError } from "./ApiErrors";
import { tokenInfo } from "../config";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: tokenInfo.secret,
  issuer: tokenInfo.issuer,
  audience: tokenInfo.audience,
};

passport.use(
  new JwtStrategy(opts, async (token: JwtPayload, done: TODO) => {
    try {
      const user = await User.findById(token.id);
      if (!user) throw new AuthFailureError("User Not Found.");
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;
