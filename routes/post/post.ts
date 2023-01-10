import passport from "../../core/passport";
import fs from "fs";
import multer from "multer";
import Post, { IPost } from "../../database/models/Post";
import { NextFunction, Request, Response } from "express";
import path from "path";
import { Archive, BackendArchive, TODO } from "../../types";
import { toMonthName, applyPagination } from "../../helpers/index";
import express from "express";
import { PipelineStage } from "mongoose";
import asyncHandler from "../../helpers/asyncHandler";
import { NotFoundError } from "../../core/ApiErrors";
import { validate, validateIdParam } from "../../core/Validator";
import { postSchema } from "./validationSchema";
import { paginationSchema } from "../paginationSchema";
import { SuccessResponse } from "../../core/ApiResponse";

const router = express.Router();

// [GET] All posts by lang
router.get(
  "/all",
  validate(postSchema.getAll, "query"),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { postLang, pagination, search } = req.body;

    let filters = {};
    if (postLang) filters = { ...filters, postLang: postLang };
    if (search) filters = { ...filters, $text: { $search: search } };

    let query = Post.find(filters);

    const count = await Post.find(filters).countDocuments();

    if (pagination) query = applyPagination(query, pagination);

    const posts = await query;

    new SuccessResponse("All posts", { posts: posts, count: count }).send(res);
  })
);

// [POST] Create Post
router.post(
  "/submit",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const newPost = await Post.create(req.body);
    new SuccessResponse("Post created.", newPost);
  })
);

// [GET] Post By Id
router.get(
  "/:id",
  validateIdParam(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const post = await Post.findById(req.params.id);

    if (!post) throw new NotFoundError("Post not found.");
    new SuccessResponse("Success", { post: post }).send(res);
  })
);

// [PATCH] Update Post
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(postSchema.postUpdate),
  validateIdParam(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPost)
      throw new NotFoundError("The post you want to update does not exist.");

    new SuccessResponse("Successfuly updated post", updatedPost).send(res);
  })
);

// [DELETE] Post by ID
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateIdParam(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const deletedPost = await Post.findByIdAndRemove(req.params.id, req.body);
    if (!deletedPost)
      throw new NotFoundError("The post you want to delete does not exist.");

    new SuccessResponse("Successfuly deleted post", deletedPost).send(res);
  })
);

// [POST] archive
router.post(
  "/archive",
  asyncHandler(async (req: Request, res: Response) => {
    let match = {};
    if (req.body.postLang) {
      match = { ...match, postLang: req.body.postLang };
    }
    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $project: {
          _id: "$_id",
          created: "$created",
          name: "$postTitle",
        },
      },
      {
        $group: {
          _id: { year: { $year: "$created" }, month: { $month: "$created" } },
          children: { $push: { name: "$name", url: "$_id" } },
        },
      },
      { $sort: { "_id.month": 1 } },
      {
        $set: {
          name: "$_id.month",
          count: { $size: "$children" },
          url: "",
        },
      },
      {
        $group: {
          _id: "$_id.year",
          children: { $push: "$$ROOT" },
        },
      },

      {
        $set: {
          name: "$_id",
          count: { $sum: "$children.count" },
          url: "",
        },
      },
      { $sort: { name: -1 } },
    ];

    let archive = await Post.aggregate(pipeline);
    // add names and do final mutations
    const mutatedArchive: Archive[] = archive.map((year) => {
      year.children.map(
        (month: any) =>
          (month.name = toMonthName(month.name, req.body.postLang))
      );
      return year;
    });

    new SuccessResponse("Archive", mutatedArchive).send(res);
  })
);

//MULTER CONFIG
const storage = multer.diskStorage({
  destination: function (req: Request, file: TODO, cb: TODO) {
    const dir = `uploads/`;

    // if folder doesnt exist on first build, create it.
    if (fs.existsSync(dir)) {
      return cb(null, dir);
    } else {
      fs.mkdir(dir, (error) => cb(error, dir));
      return cb(null, dir);
    }
  },
  filename: function (req: Request, file: TODO, cb: TODO) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// [POST] Upload IMG
const upload = multer({ storage: storage });
router.post(
  "/imgupload",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  asyncHandler(async (req: TODO, res: TODO) => {
    res.json(req.file.destination + req.file.filename);
  })
);

export default router;
