import Joi from "joi";
import { paginationSchema } from "../paginationSchema";

export const subscriptionsSchema = {
  getAll: Joi.object().keys({
    pagination: paginationSchema,
  }),
  subscribe: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
