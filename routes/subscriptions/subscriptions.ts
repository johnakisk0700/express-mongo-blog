import passport from "../../core/passport";

import express from "express";
import { ISubscribe } from "../../database/models/Subscribe";
import { TODO } from "../../types";
import Subscribe from "../../database/models/Subscribe";
import asyncHandler from "../../helpers/asyncHandler";
import { applyPagination } from "../../helpers";
import { validate } from "../../core/Validator";
import { subscriptionsSchema } from "./validationSchema";
import { BadRequestError } from "../../core/ApiErrors";
import { SuccessResponse } from "../../core/ApiResponse";
const router = express.Router();

// [GET] All subscriptions
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(subscriptionsSchema.getAll),
  asyncHandler(async (req, res, next) => {
    const { pagination } = req.body;

    const query = Subscribe.find();
    applyPagination(query, pagination);
    const subs = await query;

    new SuccessResponse("Success", subs);
  })
);

// [POST] Create subscription
router.post(
  "/",
  validate(subscriptionsSchema.subscribe),
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const alreadyExists = await Subscribe.findOne({ email: email });
    if (alreadyExists)
      throw new BadRequestError("Email is already subscribed.");

    const newSub = await Subscribe.create(req.body);
    new SuccessResponse("Subscription added successfuly", newSub).send(res);
  })
);

export default router;
