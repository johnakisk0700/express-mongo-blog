import Joi from "joi";

export const authSchema = {
  login: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
