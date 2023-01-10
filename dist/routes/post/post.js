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
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const Post_1 = __importDefault(require("../../database/models/Post"));
const path_1 = __importDefault(require("path"));
const index_1 = require("../../helpers/index");
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const ApiErrors_1 = require("../../core/ApiErrors");
const Validator_1 = require("../../core/Validator");
const validationSchema_1 = require("./validationSchema");
const ApiResponse_1 = require("../../core/ApiResponse");
const router = express_1.default.Router();
// [GET] All posts by lang
router.get("/all", (0, Validator_1.validate)(validationSchema_1.postSchema.getAll, "query"), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postLang, pagination, search } = req.body;
    let filters = {};
    if (postLang)
        filters = Object.assign(Object.assign({}, filters), { postLang: postLang });
    if (search)
        filters = Object.assign(Object.assign({}, filters), { $text: { $search: search } });
    let query = Post_1.default.find(filters);
    const count = yield Post_1.default.find(filters).countDocuments();
    if (pagination)
        query = (0, index_1.applyPagination)(query, pagination);
    const posts = yield query;
    new ApiResponse_1.SuccessResponse("All posts", { posts: posts, count: count }).send(res);
})));
// [POST] Create Post
router.post("/submit", passport_1.default.authenticate("jwt", { session: false }), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield Post_1.default.create(req.body);
    new ApiResponse_1.SuccessResponse("Post created.", newPost);
})));
// [GET] Post By Id
router.get("/:id", (0, Validator_1.validateIdParam)(), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_1.default.findById(req.params.id);
    if (!post)
        throw new ApiErrors_1.NotFoundError("Post not found.");
    new ApiResponse_1.SuccessResponse("Success", { post: post }).send(res);
})));
// [PATCH] Update Post
router.put("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, Validator_1.validate)(validationSchema_1.postSchema.postUpdate), (0, Validator_1.validateIdParam)(), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedPost = yield Post_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!updatedPost)
        throw new ApiErrors_1.NotFoundError("The post you want to update does not exist.");
    new ApiResponse_1.SuccessResponse("Successfuly updated post", updatedPost).send(res);
})));
// [DELETE] Post by ID
router.delete("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, Validator_1.validateIdParam)(), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedPost = yield Post_1.default.findByIdAndRemove(req.params.id, req.body);
    if (!deletedPost)
        throw new ApiErrors_1.NotFoundError("The post you want to delete does not exist.");
    new ApiResponse_1.SuccessResponse("Successfuly deleted post", deletedPost).send(res);
})));
// [POST] archive
router.post("/archive", (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let match = {};
    if (req.body.postLang) {
        match = Object.assign(Object.assign({}, match), { postLang: req.body.postLang });
    }
    const pipeline = [
        { $match: match },
        {
            $project: {
                _id: "$_id",
                created: "$created",
                name: "$postTitle",
            },
        },
        {
            $group: {
                _id: { year: { $year: "$created" }, month: { $month: "$created" } },
                children: { $push: { name: "$name", url: "$_id" } },
            },
        },
        { $sort: { "_id.month": 1 } },
        {
            $set: {
                name: "$_id.month",
                count: { $size: "$children" },
                url: "",
            },
        },
        {
            $group: {
                _id: "$_id.year",
                children: { $push: "$$ROOT" },
            },
        },
        {
            $set: {
                name: "$_id",
                count: { $sum: "$children.count" },
                url: "",
            },
        },
        { $sort: { name: -1 } },
    ];
    let archive = yield Post_1.default.aggregate(pipeline);
    // add names and do final mutations
    const mutatedArchive = archive.map((year) => {
        year.children.map((month) => (month.name = (0, index_1.toMonthName)(month.name, req.body.postLang)));
        return year;
    });
    new ApiResponse_1.SuccessResponse("Archive", mutatedArchive).send(res);
})));
//MULTER CONFIG
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const dir = `uploads/`;
        // if folder doesnt exist on first build, create it.
        if (fs_1.default.existsSync(dir)) {
            return cb(null, dir);
        }
        else {
            fs_1.default.mkdir(dir, (error) => cb(error, dir));
            return cb(null, dir);
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
// [POST] Upload IMG
const upload = (0, multer_1.default)({ storage: storage });
router.post("/imgupload", passport_1.default.authenticate("jwt", { session: false }), upload.single("image"), (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(req.file.destination + req.file.filename);
})));
exports.default = router;
