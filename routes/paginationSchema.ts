import Joi from "joi";

export const paginationSchema = Joi.object().keys({
  page: Joi.number().positive().required(),
  perPage: Joi.number().positive().max(20).required(),
});
