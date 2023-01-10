import Joi from "joi";

export const categoriesSchema = {
  category: Joi.object().keys({
    name: Joi.string().min(3).max(50).required(),
    greekName: Joi.string().min(3).max(50).required(),
  }),
  categoryUpdate: Joi.object().keys({
    name: Joi.string().min(3).max(50),
    greekName: Joi.string().min(3).max(50),
  }),
};
