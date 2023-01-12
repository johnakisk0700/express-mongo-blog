import Joi from "joi";
import { JoiAuthBearer } from "../../core/Validator";

export const authSchema = {
  login: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),
};
