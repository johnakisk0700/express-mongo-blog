"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiErrors_1 = require("./ApiErrors");
const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiErrors_1.ApiError) {
        ApiErrors_1.ApiError.handle(err, res);
    }
    else {
        console.log(err);
        ApiErrors_1.ApiError.handle(new ApiErrors_1.InternalError(), res);
    }
};
exports.default = errorHandler;
