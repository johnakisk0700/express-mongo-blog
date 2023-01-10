import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { Types } from "mongoose";
import { BadRequestError } from "./ApiErrors";

type ValidationSource = "body" | "params" | "query" | "headers";

export const validate =
  (schema: Joi.AnySchema, source: ValidationSource = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req[source]);
      if (!error) return next();

      const { details } = error;
      const message = details
        .map((i) => i.message.replace(/['"]+/g, ""))
        .join(",");
      //   Logger.error(message);

      next(new BadRequestError(message));
    } catch (error) {
      next(error);
    }
  };

export const JoiObjectId = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!Types.ObjectId.isValid(value)) return helpers.error("any.invalid");
    return value;
  }, "Object Id Validation");

export const JoiUrlEndpoint = () =>
  Joi.string().custom((value: string, helpers) => {
    if (value.includes("://")) return helpers.error("any.invalid");
    return value;
  }, "Url Endpoint Validation");

export const JoiAuthBearer = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!value.startsWith("Bearer ")) return helpers.error("any.invalid");
    if (!value.split(" ")[1]) return helpers.error("any.invalid");
    return value;
  }, "Authorization Header Validation");

const paramMongoIdSchema = Joi.object().keys({ id: JoiObjectId().required() });
export const validateIdParam = () => validate(paramMongoIdSchema, "params");
