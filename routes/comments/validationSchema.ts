import Joi from "joi";
import { JoiObjectId } from "../../core/Validator";
import { paginationSchema } from "../paginationSchema";

export const commentsSchema = {
  paginated: Joi.object().keys({
    pagination: paginationSchema,
  }),
  createComment: Joi.object().keys({
    postID: JoiObjectId().required(),
    commentAuthor: Joi.string().min(3).max(50).required(),
    commentContent: Joi.string().min(3).max(1000).required(),
  }),
  updateStates: Joi.object().keys({
    comments: Joi.array(),
    targetState: Joi.string().valid("pending", "approved", "cancelled"),
  }),
};
