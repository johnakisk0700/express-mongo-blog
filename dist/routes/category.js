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
const Category_1 = __importDefault(require("../database/models/Category"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("../core/passport"));
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const ApiResponse_1 = require("../core/ApiResponse");
const ApiErrors_1 = require("../core/ApiErrors");
// get the list of the category
router.get("/", (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Category_1.default.find({});
    if (!categories)
        throw new ApiErrors_1.NotFoundError("No categories found.");
    new ApiResponse_1.SuccessResponse("Categories list", categories).send(res);
})));
// get a single category by ID
router.get("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    Category_1.default.findById(req.params.id, function (err, category) {
        res.json(category);
    });
})));
// post a category
router.post("/", passport_1.default.authenticate("jwt", { session: false }), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    Category_1.default.create(req.body, function (err, category) {
        if (err)
            return next(err);
        res.json(category);
    });
})));
// update category
router.put("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    Category_1.default.findByIdAndUpdate(req.params.id, req.body, {}, function (err, category) {
        res.json(category);
    });
})));
// delete a category by ID
router.delete("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    Category_1.default.findByIdAndRemove(req.params.id, req.body, function (err, category) {
        res.json(category);
    });
})));
exports.default = router;
