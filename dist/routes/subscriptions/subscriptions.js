"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("../../core/passport"));
const express_1 = __importDefault(require("express"));
const Subscribe_1 = __importDefault(require("../../database/models/Subscribe"));
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const helpers_1 = require("../../helpers");
const Validator_1 = require("../../core/Validator");
const validationSchema_1 = require("./validationSchema");
const ApiErrors_1 = require("../../core/ApiErrors");
const ApiResponse_1 = require("../../core/ApiResponse");
const router = express_1.default.Router();
// [GET] All subscriptions
router.get("/", passport_1.default.authenticate("jwt", { session: false }), (0, Validator_1.validate)(validationSchema_1.subscriptionsSchema.getAll), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pagination } = req.body;
    const query = Subscribe_1.default.find();
    (0, helpers_1.applyPagination)(query, pagination);
    const subs = yield query;
    new ApiResponse_1.SuccessResponse("Success", subs);
})));
// [POST] Create subscription
router.post("/", (0, Validator_1.validate)(validationSchema_1.subscriptionsSchema.subscribe), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const alreadyExists = yield Subscribe_1.default.findOne({ email: email });
    if (alreadyExists)
        throw new ApiErrors_1.BadRequestError("Email is already subscribed.");
    const newSub = yield Subscribe_1.default.create(req.body);
    new ApiResponse_1.SuccessResponse("Subscription added successfuly", newSub).send(res);
})));
exports.default = router;
