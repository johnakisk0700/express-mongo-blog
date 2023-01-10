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
const Category_1 = __importDefault(require("../../database/models/Category"));
const passport_1 = __importDefault(require("../../core/passport"));
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const ApiResponse_1 = require("../../core/ApiResponse");
const ApiErrors_1 = require("../../core/ApiErrors");
const express_1 = __importDefault(require("express"));
const validationSchema_1 = require("./validationSchema");
const Validator_1 = require("../../core/Validator");
const router = express_1.default.Router();
// [GET] All Categories
router.get("/", (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Category_1.default.find().lean();
    if (!categories)
        throw new ApiErrors_1.NotFoundError("No categories found.");
    new ApiResponse_1.SuccessResponse("Categories list", categories).send(res);
})));
// [POST] Add Category
router.post("/add", passport_1.default.authenticate("jwt", { session: false }), (0, Validator_1.validate)(validationSchema_1.categoriesSchema.category), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    Category_1.default.create(req.body, function (err, category) {
        if (err)
            return next(err);
        res.json(category);
    });
})));
// [GET] Single category by ID
router.get("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, Validator_1.validateIdParam)(), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const category = yield Category_1.default.findById(id).lean();
    if (!category)
        throw new ApiErrors_1.NotFoundError(`No category with id: ${id} found.`);
    new ApiResponse_1.SuccessResponse("Success", category).send(res);
})));
// [PATCH] update category
router.patch("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, Validator_1.validate)(validationSchema_1.categoriesSchema.categoryUpdate), (0, Validator_1.validateIdParam)(), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cat = yield Category_1.default.findById(req.params.id);
    if (!cat)
        throw new ApiErrors_1.NotFoundError("Cannot find category to update.");
    const updatedCat = yield Category_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    new ApiResponse_1.SuccessResponse("Successfuly updated category", updatedCat).send(res);
})));
// [DELETE] Category by ID
router.delete("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, Validator_1.validateIdParam)(), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedCat = yield Category_1.default.findByIdAndRemove(req.params.id, req.body);
    if (!deletedCat)
        throw new ApiErrors_1.NotFoundError("Category not found.");
    new ApiResponse_1.SuccessResponse(`Successfuly deleted category ${deletedCat.name}`, deletedCat).send(res);
})));
exports.default = router;
