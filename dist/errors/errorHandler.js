"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FreebirthError_1 = require("./FreebirthError");
const errorHandler = (err, req, res, next) => {
    if (err instanceof FreebirthError_1.FreebirthError)
        res.status(err.statusCode).json({ msg: err.message });
    res.status(500).json({ msg: err.message });
};
exports.default = errorHandler;
