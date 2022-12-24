"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreebirthError = void 0;
class FreebirthError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.FreebirthError = FreebirthError;
const createFreebirthError = (msg) => {
    return new FreebirthError(msg, 420);
};
exports.default = createFreebirthError;
