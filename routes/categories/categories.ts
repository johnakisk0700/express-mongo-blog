import { CallbackError } from "mongoose";
import { TODO } from "../../types";
import Category, { ICategory } from "../../database/models/Category";
import passport from "../../core/passport";
import asyncHandler from "../../helpers/asyncHandler";
import { SuccessResponse } from "../../core/ApiResponses";
import { NotFoundError } from "../../core/ApiErrors";
import express from "express";
import { categoriesSchema } from "./validationSchema";
import { validate, validateIdParam } from "../../core/Validator";

const router = express.Router();

// [GET] All Categories
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const categories = await Category.find().lean();
    if (!categories) throw new NotFoundError("No categories found.");

    new SuccessResponse("Categories list", categories).send(res);
  })
);

// [POST] Add Category
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  validate(categoriesSchema.category),
  asyncHandler(async (req, res, next) => {
    Category.create(req.body, function (err: TODO, category: ICategory) {
      if (err) return next(err);
      res.json(category);
    });
  })
);

// [GET] Single category by ID
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateIdParam(),
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const category = await Category.findById(id).lean();
    if (!category) throw new NotFoundError(`No category with id: ${id} found.`);

    new SuccessResponse("Success", category).send(res);
  })
);

// [PATCH] update category
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(categoriesSchema.categoryUpdate),
  validateIdParam(),
  asyncHandler(async (req, res, next) => {
    const cat = await Category.findById(req.params.id);
    if (!cat) throw new NotFoundError("Cannot find category to update.");

    const updatedCat = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    new SuccessResponse("Successfuly updated category", updatedCat).send(res);
  })
);

// [DELETE] Category by ID
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateIdParam(),
  asyncHandler(async (req, res, next) => {
    const deletedCat = await Category.findByIdAndRemove(
      req.params.id,
      req.body
    );
    if (!deletedCat) throw new NotFoundError("Category not found.");
    new SuccessResponse(
      `Successfuly deleted category ${deletedCat.name}`,
      deletedCat
    ).send(res);
  })
);

export default router;
