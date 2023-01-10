import { NextFunction, Request, Response } from "express";
import { ApiError, InternalError } from "./ApiErrors";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    console.log(err);
    ApiError.handle(new InternalError(), res);
  }
};
export default errorHandler;
