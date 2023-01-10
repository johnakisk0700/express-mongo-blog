import { Router } from "express";

import jwt from "jsonwebtoken";
import User, { IUser } from "../../database/models/User";
import asyncHandler from "../../helpers/asyncHandler";
import { AuthFailureError, InternalError } from "../../core/ApiErrors";
import * as bcrypt from "bcrypt";
import { SuccessResponse } from "../../core/ApiResponses";
import { validate } from "../../core/Validator";
import { authSchema } from "./validationSchema";
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

    const accessToken = jwt.sign(
      user.toJSON(),
      process.env.ACCESS_SECRET as string
    );
    const refreshToken = jwt.sign(
      user.toJSON(),
      process.env.REFRESH_SECRET as string
    );

    new SuccessResponse("Log in successful.", {
      accessToken,
      refreshToken,
      username: user.username,
    }).send(res);
  })
);

export default router;
