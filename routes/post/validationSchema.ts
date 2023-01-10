import Joi from "joi";
import { JoiObjectId } from "../../core/Validator";
import { paginationSchema } from "../paginationSchema";

export const postSchema = {
  getAll: Joi.object().keys({
    postLang: Joi.valid("en", "el").required(),
    search: Joi.string(),
    pagination: paginationSchema,
  }),
  post: Joi.object().keys({
    category: JoiObjectId().required(),
    postTitle: Joi.string().min(6).max(120).required(),
    postAuthor: Joi.string().min(6).max(120).required(),
    postDesc: Joi.string().min(20).max(500).required(),
    postLang: Joi.valid("en", "el").required(),
    postContent: Joi.string().min(20).max(5000).required(),
    postImgUrl: Joi.string().required(),
  }),
  postUpdate: Joi.object().keys({
    category: JoiObjectId(),
    postTitle: Joi.string().min(6).max(120),
    postAuthor: Joi.string().min(6).max(120),
    postDesc: Joi.string().min(20).max(500),
    postLang: Joi.valid("en", "el"),
    postContent: Joi.string().min(20).max(5000),
    postImgUrl: Joi.string(),
  }),
};
