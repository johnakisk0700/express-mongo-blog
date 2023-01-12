import { Router } from "express";

import jwt from "jsonwebtoken";
import User, { IUser } from "../../database/models/User";
import asyncHandler from "../../helpers/asyncHandler";
import {
  AuthFailureError,
  BadRequestError,
  InternalError,
  NotFoundError,
} from "../../core/ApiErrors";
import * as bcrypt from "bcrypt";
import { SuccessResponse } from "../../core/ApiResponses";
import { validate } from "../../core/Validator";
import { authSchema } from "./validationSchema";
import { tokenInfo } from "../../config";
import { createTokens, ITokenPayload } from "./utils";
const router = Router();

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const newUser = new User({
      username: username,
      password: password,
    });

    // save the user
    const savedUser = await newUser.save();
    if (!savedUser) throw new InternalError("Invalid e-mail perhaps?");

    new SuccessResponse("Registered successfuly.", {
      user: savedUser,
    });
  })
);

router.post(
  "/login",
  validate(authSchema.login),
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) throw new AuthFailureError("Wrong username.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AuthFailureError("Wrong password.");

    const { accessToken, refreshToken } = createTokens(user.name, user.id);

    new SuccessResponse("Log in successful.", {
      accessToken,
      refreshToken,
    }).send(res);
  })
);

router.post(
  "/refresh",
  validate(authSchema.auth, "headers"),
  validate(authSchema.refreshToken),
  asyncHandler(async (req, res) => {
    const parsed = jwt.verify(req.body.refreshToken, tokenInfo.refreshSecret);
    const { id } = parsed as ITokenPayload;

    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User does not exist.");

    const { accessToken, refreshToken } = createTokens(user.username, user.id);

    new SuccessResponse("Successfuly refreshed tokens.", {
      accessToken,
      refreshToken,
    }).send(res);
  })
);
export default router;
